# RAG-PDF Chatbot

A fully functional AI chatbot that allows users to upload PDF files, generates embeddings for the content using a custom Flask API, stores them into a Qdrant vector database, and answers user queries based on the document context with the help of GPT-4.1.

---

## Features

- 📂 **PDF Upload**: Upload any PDF to extract and process content.
- 🧬 **Embedding Generation**: Custom Flask API generates embeddings using a deep learning model.
- 🔍 **Vector Storage**: Embeddings are stored efficiently in Qdrant vector database.
- 🧪 **Context Retrieval**: Uses LangChain to fetch relevant context based on user query.
- 💬 **Smart Responses**: GPT-4.1 generates accurate answers using context fetched from vector database.

---

## Tech Stack

- **Frontend**: Next.js (TypeScript, TailwindCSS, framer-motion, clerk auth).
- **Backend**: Flask (for embeddings generation), LangChain (for context retrieval), nodejs, valkey, etc.
- **Database**: Qdrant (Vector Database).
- **AI Models**: Custom model for embeddings, OpenAI's GPT-4.1 for answering queries.
- **Utilities**: LangChain for smart retrieval, Framer Motion for animations.

---

## Project Structure

```
- /client 
|  |- Next JS project here
|  |- ...
|
- |/server
| |- .venv/...
| |- node_modules/...
| |- uploads/... (uploaded pdfs goes here)
| |- .env (enviroment variables)
| |- embed_service.py (flask api for generating vector embeddings)
| |- index.js (main server with routes and others) 
| |- worker.js (handles pdf and database)
| |- package.json
| |- package.lock.json
| |- requirements.txt
|
- docker-compose.yml
```

---

## Setup Instructions
There are many server you need to run before actually using the application. Installation instructions are as follows:

# Installation Guide :

Clone the repository:
```bash
git clone https://github.com/sujal-cs/rag-chatbot.git # clone repository
cd rag-chatbot
```

Now install dependencies :

- Frontend: 

```
cd client
npm install # or pnpm install 
```

- Backend:
For nodejs servers
```
cd server
npm install 
```

For Flask API 

For Windows user:
```
cd server 
python -m venv .venv # create virtual enviroment

.\.venv\Scripts\activate # activate virtual enviroment


```
OR 

For Linux user:
```
cd server 
python3 -m venv .venv # create virtual enviroment

source .venv/bin/activate # activate virtual enviroment
```

# Run servers:
- **Now Run each server after Installation IMP** 
1.Frontend NextJS appilcation:

```bash 
cd client
npm run dev
```

2.Docker (docker-compose.yml)
```bash 
docker compose up -d (run this at root of the project)
```

3.Backend (index.js)
```bash 
cd server
npm run dev
```

4.Backend (worker.js)
```bash 
cd server
npm run dev:worker
```

5.Flask API/server
```bash
cd server
source .venv/bin/activate # For linux user
.\.venv\Scripts\activate # For windows user
```

Make sure add your own enviroment variables into the app  

## How It Works

1. **Upload PDF** ➔ Extract text ➔ Generate embeddings
2. **Store embeddings** into Qdrant DB.
3. **User sends a query**.
4. **Query is embedded** and used to **search related vectors**.
5. **Relevant context** is passed to **GPT-4.1** along with the user query.
6. **Response is generated** based on context.

---

## Future Improvements

- ✨ More optimized embedding models
- ✨ Add chat history & conversation threading

---

## Author

Made with ❤️ by **Sujal**

> [LinkedIn](https://www.linkedin.com/in/sujal-lokhande-s70/) | [GitHub](https://github.com/sujal-cs) | [X/Twitter](https://x.com/SujalLokhande70) 

---


Thank you for checking out the project! 🚀

