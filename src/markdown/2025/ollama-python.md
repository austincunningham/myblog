
# Build a Local AI RAG App with Ollama and Python

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fkwt1jqnwkfrax0iqlvn.png)

I was looking to do a little development around AI and decided to see what I could build on my PC.

We tried [Ollama](https://ollama.com/download/linux) for a local development environment. Ollama is an open-source tool that makes it easy to download, run, and manage large language models (LLMs) on your own computer. 
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
Once downloaded and installed you can run as follows
```bash
~ ollama -v         
ollama version is 0.6.5
~ ollama run mistral
>>> tell me about ollama run mistral
 "Olama Run Mistral is a high-performance, open-source machine learning platform developed by OLMA.AI, a company based in Paris, France. The platform is designed to simplify the development and deployment of large-scale machine 
learning models with a focus on deep learning.
Mistral stands out for its scalability, flexibility, and ease of use. It's built around a distributed architecture that allows users to train and deploy large-scale machine learning models efficiently across multiple GPUs and 
clusters, reducing the time required for training and inference significantly.
Some key features of Olama" # ====> you get the idea a chatbot in your terminal
```
There is a bunch of models you can run https://ollama.com/search we will stick to mistral for the time being. And we need to keep it running to use it.

So what are we going to try to do ? We are going to create an chat app that can query my local files directory and return answers based off the contents.  

First create requirements.txt and add the following, basically some libraries for interacting with text and ollama
```bash
langchain
langchain-community
langchain-ollama
langchain-huggingface
chromadb
sentence-transformers
```
Setup a virtual environment and install the requirements
```bash
sudo dnf install gcc-c++ python3-devel
pip install langchain chromadb sentence-transformers ollama
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt 
```

I create two files a main.py and utils/loaders.py
## utils/loaders.py 
```python
from langchain_community.document_loaders import DirectoryLoader, TextLoader

import os


def load_sop_files(directory: str):
    allowed_exts = ('.md', '.asciidoc', '.txt')

    docs = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(allowed_exts):
                path = os.path.join(root, file)
                try:
                    loader = TextLoader(path, encoding='utf-8')
                    docs.extend(loader.load())
                except Exception as e:
                    print(f"❌ Error loading {path}: {e}")
    return docs
```
utils/loaders.py function takes in a directory path and goes through all the files and finds type md,asciidoc and txt and breaks them up into an array utf-8 formatted langchain docs. 

## main.py
First thing I do in main.py is add the libraries and then call the function in utils/loaders.py to load my docs into the application. 
```python
from utils.loaders import load_sop_files 
from langchain.text_splitter import 
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM
from langchain_huggingface import HuggingFaceEmbeddings




# Load and prepare documents
print("📂 Loading SOP documents...")
# pointing to local directory that is the same level as this project
docs = load_sop_files("../help/sops/")
```
LLM's need data split up into smaller sizes  

```python  
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
chunks = splitter.split_documents(docs)
```
We then need to convert the document data into a numeric format that can be handled by the LLM 
```python

print("🧠 Creating vector database...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = Chroma.from_documents(chunks, embeddings)
```

We set up Ollama mistral to take the numeric db data and use to 
to formulate its answers, We are not training a modal here but 
using the RAG(Retrieval-Augmented Generation) pattern

```python 
retriever = db.as_retriever()
llm = OllamaLLM(model="mistral")
qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=True)
```
>**NOTE :** We are using the OllamaLLM and RetrievalQA to connect to our local LLM API but we could use the [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md) here with the `/api/generate` end point, but this would be more verbose. 

We then have a loop here to answer queries using the qa we created earlier as a source with the invoke function

```python

print("🤖 SOP Assistant ready. Type your question below. Type 'exit' to quit.")



while True:
   query = input("\n📝 You: ")
   if query.lower() in ("exit", "quit"):
       print("👋 Bye! Take care.")
       break


   result = qa.invoke({"query": query})


   print("\n🤖 Assistant:\n", result["result"])


   print("\n📎 Sources:")
   for doc in result["source_documents"]:
       print(f" - {doc.metadata.get('source')}")
```
Repo https://github.com/austincunningham/sop_assistant 

It's returning answers based off the `../help/sops` directory we passed in earlier 

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l21ciivffm9y8h2fjwvw.png)

Credit to https://github.com/valerymo for a lot of the investigation on getting this operational.
