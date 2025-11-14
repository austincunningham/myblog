# Building an AI-Powered Log Analyser with RAG
![Ollama banner image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3fp56eoahz36n32q1uz7.png)

I was looking to build something useful with AI development. I frequently use AI to analyze individual log files, so I thought it would be valuable to create a log analyzer that can process entire directories of log files to identify issues and provide an overall picture of system problems.  

Traditional approaches fail:
- **grep/awk**: Too rigid, misses context
- **Manual reading**: Impossible with large files or many individual files
- **Basic search**: No understanding of log semantics

I will build a **Retrieval-Augmented Generation (RAG)** system that transforms your log files into an intelligent, queryable knowledge base. 


## Prerequisites

```bash
# Install Ollama (for local LLM)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the Mistral model
ollama pull mistral
```

### Project Setup

```bash
# Create project directory
mkdir rag_log_analyser
cd rag_log_analyser

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install langchain langchain-community langchain-ollama langchain-huggingface chromadb sentence-transformers
```

### Core Architecture

```
📁 rag_log_analyser/
├── main.py              # Main application
├── utils/
│   └── loaders.py       # Custom log file loader
└── requirements.txt     # Dependencies
```

### Custom Log Loader (`utils/loaders.py`)

The idea here is treating each log line as an individual document. Let's break down exactly what each part does:

#### **Set the Type of Files to Find**

```python
def load_sop_files(directory: str):
    allowed_exts = ('.log', '.txt', '.out', '.err', '.access', '.csv', '.json', '.yaml', '.yml', '.md', '.asciidoc')
    
    docs = []
    file_count = 0
    total_lines = 0
```
- Defines supported file extensions (covers most log formats)
- Initializes tracking variables for progress reporting
- Creates empty list to store document objects

#### **Processing Files Line by Line**
```python
for root, _, files in os.walk(directory):
    for file in files:
        file_lower = file.lower()
        if file_lower.endswith(allowed_exts):
            path = os.path.join(root, file)
            file_count += 1
            print(f"📄 Processing file {file_count}: {file}")
            
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    line_count = 0
                    for i, line in enumerate(f):
                        if line.strip():  # Skip empty lines
                            docs.append({
                                "page_content": line.strip(),
                                "metadata": {"source": path, "line_number": i + 1}
                            })
                            line_count += 1
                            total_lines += 1
                            
                            # Show progress for large files
                            if line_count % 10000 == 0:
                                print(f"   📊 Processed {line_count:,} lines...")
                    
                    print(f"   ✅ Completed: {line_count:,} lines processed")
            except Exception as e:
                print(f"❌ Error loading {path}: {e}")

print(f"📊 Summary: Processed {file_count} files, {total_lines:,} total log entries")
return [Document(**d) for d in docs]
```

This function does several important things:
- **Finds all log files**: The `os.walk(directory)` function recursively searches through directories, while `file_lower.endswith(allowed_exts)` filters files by extension using case-insensitive matching
- **Processes each line separately**: The `for i, line in enumerate(f)` loop treats every non-empty line as its own document using `if line.strip()` 
- **Tracks metadata**: Each line gets stored with `{"source": path, "line_number": i + 1}` metadata, making it easy to trace back to the original file location
- **Shows progress**: The `if line_count % 10000 == 0` condition displays progress every 10,000 lines with `print(f"📊 Processed {line_count:,} lines...")` so you know it's working on large files
- **Handles errors gracefully**: The `try/except` block catches file reading errors with `except Exception as e` and logs them while continuing with other files
- **Returns LangChain documents**: The final `return [Document(**d) for d in docs]` converts our dictionary format into LangChain Document objects needed for embedding and vector storage


### Main Application (`main.py`)

Let's break down the main application into logical sections:

#### **Imports & Dependencies**
The imports
```python
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

from utils.loaders import load_sop_files
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM
```

#### **Directory Input & Validation**
```python
try:
    LOG_DIRECTORY = input("➡️ Please enter the full path to the log directory: ")
    if not os.path.isdir(LOG_DIRECTORY):
        print(f"❌ Error: Directory not found at '{LOG_DIRECTORY}'")
        sys.exit(1)
except KeyboardInterrupt:
    print("\n\n👋 Goodbye. Exiting...")
    sys.exit(0)
```
- Prompts user for log directory path
- Validates directory exists before processing
- **Keyboard interrupt handling**: Graceful exit with Ctrl+C
- User-friendly error messages

#### **Document Loading & Processing**
```python
try:
    print(f"📂 Loading log files from: {LOG_DIRECTORY}...")
    docs = load_sop_files(LOG_DIRECTORY)
    print(f"✅ Loaded {len(docs)} log entries from files")
except KeyboardInterrupt:
    print("\n\n⏹️  File loading interrupted by user. Exiting ...")
    sys.exit(0)
```
- Calls our custom loader to process all log files
- Shows progress during file processing
- Reports total number of log entries found

#### **Vector Database Creation (The Heavy Lifting)**
```python
print(f"🧠 Creating vector database with {len(chunks)} log entries...")
print("⏳ This may take several minutes for large files...")

# Check if database already exists
db_path = "./chroma_db"
db_exists = os.path.exists(db_path)
if db_exists:
    rebuild_choice = input("🔄 Vector database already exists. Rebuild? (y/n): ")

# Optimized embedding settings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True, 'batch_size': 32}
)

if db_exists and rebuild_choice != 'y':
    print("📂 Found existing vector database, loading...")
    db = Chroma(persist_directory=db_path, embedding_function=embeddings)
    print("✅ Vector database loaded successfully")
else:
    print("📊 Creating new vector database...")
    db = Chroma.from_documents(
        chunks, embeddings,
        persist_directory=db_path,
        collection_metadata={"hnsw:space": "cosine"}
    )
    print("✅ Vector database created and saved")
```
- **Persistent Storage**: Database saved to `./chroma_db/` for reuse
- **Optimized Embeddings**: Fast model with batch processing (32 items/batch)
- **Smart Loading**: Reuses existing database unless rebuild requested
- **This is the bottleneck**: Large files take time on first run only

#### **RAG Chain Setup**
```python
retriever = db.as_retriever()
llm = OllamaLLM(model="mistral")
qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=True)
```
- **Retriever**: Finds most relevant log entries for each query
- **LLM**: Mistral model for generating intelligent responses
- **RAG Chain**: Combines retrieval + generation for contextual answers
- **Source Documents**: Returns original log entries for verification

#### **Interactive Query Loop & Prompt Engineering**
Loop for handling queries and prompt engineering

```python
try:
    while True:
        query = input("\n📝 You (e.g., 'What errors occurred in the last hour?'): ")
        if query.lower() in ("exit", "quit"):
            print("👋 Bye! Take care.")
            break
        
        # LLM prompt engineering This is what give the LLM it's context to formulate it's response
        analysis_query = (
            "You are an expert log analyser. Review the provided log entries and answer the user's question. "
            "Provide a concise summary, highlight any potential issues, and mention the relevant source log files. "
            f"Question: {query}"
        )

        try:
            result = qa.invoke({"query": analysis_query})
            # ... display results ...
        except KeyboardInterrupt:
            print("\n⏹️  Query processing interrupted. You can ask another question.")
            continue
except KeyboardInterrupt:
    print("\n\n👋 Goodbye! Exiting...")
    sys.exit(0)
```


#### **Response Display & Source Attribution**
```python
print("\n🤖 Assistant:\n", result["result"])

print("\n📎 Sources:")
for doc in result["source_documents"]:
    source = doc.metadata.get('source')
    line_number = doc.metadata.get('line_number')
    print(f" - {source}{f' (Line {line_number})' if line_number else ''}")
```
- Displays AI-generated analysis
- Shows source files and line numbers for verification
- Enables traceability back to original log entries

## How It Works
You start Ollama 

```bash
ollama run mistral
```
In a seperate window start the log analyser and 
```
python main.py
Starting script...
_______________________________________________________________________________
 _ __ __ _  __ _    | | ___   __ _      __ _ _ __   __ _| |_   _ ___  ___ _ __
| '__/ _` |/ _` |___| |/ _ \ / _` |___ / _` | '_ \ / _` | | | | / __|/ _ | '__|
| | | (_| | (_| |___| | (_) | (_| |___| (_| | | | | (_| | | |_| \__ |  __| |
|_|  \__,_|\__, |   |_|\___/ \__, |    \__,_|_| |_|\__,_|_|\__, |___/\___|_|
           |___/              |___/                         |___/
_______________________________________________________________________________
                                                                                        
                                                                                          
                                                                                          
➡️ Please enter the full path to the log directory (e.g., /home/user/support/):
```
Pass in the full directory to the log files you wish to query


### **Step 1: Document Processing**
The log file will get processed output will look similar to below
```bash
📄 Processing file 1: application.log
   📊 Processed 10,000 lines...
   📊 Processed 20,000 lines...
   ✅ Completed: 45,123 lines processed
📊 Summary: Processed 1 files, 45,123 total log entries
```
**What happens:**
- Each log line becomes a separate document
- Metadata tracks source file and line number
- Progress tracking for large files

#### **Step 2: Vector Database Creation**
Next the database is created. 
```bash
🧠 Creating vector database with 45,123 log entries...
⏳ This may take several minutes for large files...
🔄 Vector database already exists. Rebuild? (y/n): y
🚀 Using optimized embedding model for faster processing...
📊 Generating embeddings...
✅ Vector database created successfully
```
**What happens:**
- Each log line gets converted into a unique numerical "fingerprint" (384 numbers)
- Vectors stored in ChromaDB for fast retrieval
- This can take a while

>**NOTE:** if you have built the vector DB already you have an opt out here so you can use an existing DB rather than rebuilding each time.

Once the vector database is successfully built, you can query the LLM to get answers based on the loaded log files.
```bash
✅ Vector database loaded successfully
🤖 Log Analyser Assistant ready. Type your question below. Type 'exit' to quit.

📝 You (e.g., 'What errors occurred in the last hour?'): 
```


Sample response
```bash
🤖 Log Analyser Assistant ready. Type your question below.

📝 You: What errors occurred in the last hour?

🤖 Assistant:
Based on the log entries, I found several errors in the last hour:

1. **Database Connection Error** (2 occurrences)
   - Time: 14:23:15, 14:45:22
   - Error: "Connection timeout to database server"
   - Severity: CRITICAL

2. **Authentication Failure** (5 occurrences)
   - Time: 14:12:33, 14:18:45, 14:25:12, 14:31:56, 14:42:18
   - Error: "Invalid credentials for user admin"
   - Severity: WARNING

📎 Sources:
 - /var/log/application.log (Line 1247)
 - /var/log/application.log (Line 1253)
 - /var/log/application.log (Line 1289)
```

Code lives here [https://github.com/austincunningham/rag_log_analyser](https://github.com/austincunningham/rag_log_analyser)





