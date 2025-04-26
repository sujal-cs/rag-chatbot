import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant" ;
import axios from "axios";
import dotenv from "dotenv";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";
import path from "path";


dotenv.config();


// DECLARE VARIABLES HERE
const PORT = 8000; // Server port number
const UPLOAD_DIR = "uploads"; // pdfs directory storage location (could be aws's s3 bucket in future)
const EMBED_SERVICE_URL = process.env.EMBED_SERVICE_URL || "http://localhost:5000"; // flask server to create vector embeddings
const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333"; // default quadrant url
const COLLECTION_NAME = process.env.QDRANT_COLLECTION || "pdf-docs"; // vectore db collection name 
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT || "https://models.github.ai/inference"; // open-ai's 4.1 model endpoint
const AZURE_MODEL = process.env.AZURE_MODEL || "openai/gpt-4.1"; // AI model used
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""; // Token for model autherization 


// HTTP embeddings here 
class HttpEmbeddings {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // batch for indexing
  async embedDocuments(texts) {
    return Promise.all(texts.map(t => this._embedText(t)));
  }

  // single for retrieval
  async embedQuery(text) {
    return this._embedText(text);
  }

  async _embedText(text) {
    const res = await axios.post(
      `${this.endpoint}/embed`,
      { text },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data.embedding;
  }
}


// chat client (gpt's 4.1)
const chatClient = ModelClient(
  AZURE_ENDPOINT,
  new AzureKeyCredential(GITHUB_TOKEN)
);


// Express app 
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(`/${UPLOAD_DIR}`, express.static(path.join(process.cwd(), UPLOAD_DIR))); // to serve static pdf files (upload folder)

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${suffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });
const queue = new Queue("file-upload-queue", {
  connection: { host: "localhost", port: 6379 },
});


// PDF upload route
app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }
  const job = await queue.add("file-ready", {
    filename: req.file.filename,
    path: req.file.path,
  });
  console.log(`👨🏻‍🏭 Enqueued job ${job.id}`);
  res.json({ message: "uploaded", jobId: job.id });
});

// chat route
app.get("/chat", async (req, res) => {

  const userQuery = req.query.q; // user query here
  console.log("❓ User Query:", userQuery);

  // 1) use HTTP embeddings
  const embeddings = new HttpEmbeddings(EMBED_SERVICE_URL);

  // 2) connect to Qdrant with that embedder
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    { url: QDRANT_URL, collectionName: COLLECTION_NAME }
  );

  // 3) retrieve top‐3 docs
  const retriever = vectorStore.asRetriever({ k: 3 }); // k = number of top relevant docs 
  const docs = await retriever.getRelevantDocuments(userQuery);

  // 4) build system prompt
  const SYSTEM_PROMPT = `You are a helpful AI assistant who answers the user query based on the avaliable context that is a document (pdf) uploaded by user through app. If the user ask any query but not in context just say that "I don't have the relevant context to answer that please upload relevant pdf for that!!" note that you can reply back the general question 
  Context:
  ${JSON.stringify(docs, null, 2)}
  `

  // 5) call Azure GPT-4.1
  const response = await chatClient.path("/chat/completions").post({
    body: {
      model: AZURE_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery }
      ],
      temperature: 1,
      top_p: 1,
    }
  });

  if (isUnexpected(response)) {
    console.error("Azure Model API Error:", response.body.error);
    return res.status(500).json({ error: response.body.error.message });
  }

  const answer = response.body.choices[0].message.content;
  console.log("🤖 Model Response:", answer);
  res.json({ message: answer, docs });
});

// List uploaded PDFs route
app.get("/list/pdfs", (req, res) => {
  const uploadsPath = path.join(process.cwd(), UPLOAD_DIR);

  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      console.error("Failed to read uploads directory:", err);
      return res.status(500).json({ error: "Failed to read uploaded files" });
    }

    const pdfFiles = files
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => ({
        name: file,
        url: `http://localhost:${PORT}/${UPLOAD_DIR}/${file}`,
      }));

    res.json({ files: pdfFiles });
  });
});


// Start Server
app.listen(PORT, () => {
  console.log(`💡 Server running on http://localhost:${PORT}`);
});

