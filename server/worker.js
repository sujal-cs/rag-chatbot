import { Worker } from 'bullmq';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { CharacterTextSplitter } from '@langchain/textsplitters';
import { QdrantVectorStore } from '@langchain/qdrant';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


// DECLARE VARIABLES HERE
const EMBED_SERVICE_URL = process.env.EMBED_SERVICE_URL || 'http://localhost:5000'; // Embedding server
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333'; // defautl qdrant store address (use /dashboard to acess all the docs)
const COLLECTION = process.env.QDRANT_COLLECTION || 'pdf-docs'; // vector db collection name 


// A simple HTTP-based Embeddings adapter
class HttpEmbeddings {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // Embed an array of texts by calling the Flask embed service
  async embedDocuments(texts) {
    const embeddings = await Promise.all(
      texts.map(async (text) => {
        const res = await axios.post(`${this.endpoint}/embed`, { text });
        return res.data.embedding;
      })
    );
    return embeddings;
  }

  // Embed a single query
  async embedQuery(text) {
    const res = await axios.post(`${this.endpoint}/embed`, { text });
    return res.data.embedding;
  }
}

console.log('🥽 Worker started\n');

// Instantiate the worker
new Worker(
  'file-upload-queue',
  async (job) => {
    const { path } = job.data;
    console.log('🗃️ Processing job for file:\n', path);

    // 1) Load PDF
    const loader = new PDFLoader(path);
    const docs = await loader.load();

    // 2) Split into chunks
    const splitter = new CharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`📑 Split into ${splitDocs.length} docs`);

    // 3) Embed via HTTP service
    const httpEmbeddings = new HttpEmbeddings(EMBED_SERVICE_URL);

    // 4) Connect to existing Qdrant collection
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      httpEmbeddings,
      { url: QDRANT_URL, collectionName: COLLECTION }
    );

    // 5) Add documents (will call embedDocuments under the hood)
    await vectorStore.addDocuments(splitDocs);
    console.log(`✅ Successfully added ${splitDocs.length} docs to Qdrant\n`);
  },
  {
    concurrency: 100,
    connection: { host: 'localhost', port: 6379 },
  }
);

console.log('🛠️ Worker is listening for jobs...\n');
