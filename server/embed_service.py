import torch
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModel

# A light weight model of embeddings 
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
embed_model = AutoModel.from_pretrained(MODEL_NAME)

app = Flask(__name__)

@app.route('/embed', methods=['POST'])
def embed():
    
    data = request.get_json()
    text = data.get('text', '')

    # Tokenize and encode
    inputs = tokenizer(
        text,
        padding=True,
        truncation=True,
        return_tensors='pt'
    )

    # Forward pass
    with torch.no_grad():
        outputs = embed_model(**inputs)
        # Mean-pooling over token embeddings
        embeddings = outputs.last_hidden_state.mean(dim=1)

    embedding = embeddings.squeeze().tolist()
    return jsonify({ 'embedding': embedding })

if __name__ == '__main__':
    PORT = 5000 # Serve on port 8000
    app.run(host='0.0.0.0', port=PORT)


