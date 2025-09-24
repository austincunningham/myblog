
# Build an Ollama LLM software engineering language bot 

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rfh0fafahopbbb5cmk6w.png)

## What
Another step in AI learning I decided to see if I could build a AI software engineering language bot with an SRE context. We are going to use Ollama, a locally hosted LLM, all thought you could use any LLM chat endpoint by adjusting the backend.

## Prerequisites
- ollama
- python3
- pip

Install and run ollama
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run llama3
```


## Scaffold 
Create the following layout
```bash
sre-language-bot/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── templates/
│   └── index.html
└── app.py

```

The ccs and js can remain empty for now

## Backend
We setup a basic flask app in app.py
```python
import os
import requests
import json
from flask import Flask, request, jsonify, render_template

# Initialize Flask
app = Flask(__name__)

# Home route to serve the HTML UI from the templates folder
@app.route('/')
def index():
    # load the html on the default route
    return render_template('index.html')


if __name__ == '__main__':
    # Flask will run on localhost:5000 by default.
    # The debug=True flag automatically reloads the server on code changes.
    app.run(debug=True)
```
And add something to index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
    <h1>Chat bot goes here</h1>
</body>
</html>
```
Run the `python app.py` to see if it works
```bash
python app.py
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 661-293-891
127.0.0.1 - - [08/Aug/2025 12:42:06] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [08/Aug/2025 12:42:06] "GET /favicon.ico HTTP/1.1" 404 -

```
![Basic webpage with message chatbot goes here](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/opgp5i1vp9eb1vchz3tp.png)

### Add the chat bot post request 
In `app.py` we add the post request, basically create a **/chat** endpoint and create a prompt *(the important bit for giving the llm context on which to base your answers)* for the llm which favours software engineering answers in payload.messages.content
```python
@app.route('/chat', methods=['POST'])
def chat():
    # get the chat history
    data = request.json
    chat_history = data.get('messages', [])

    if not chat_history:
        return jsonify({'error': 'No message history provided'}), 400

    try:
        ollama_model = "llama3"
        ollama_api_url = "http://localhost:11434/api/chat"

        # The payload for the Ollama API request, including a specialized system prompt
        payload = {
            "model": ollama_model,
            "stream": False,  # We want a single, complete response
            "messages": [
                            {
                                "role": "system",
                                "content": "You are a helpful and knowledgeable assistant specializing in **Golang, Python,Bash and JavaScript** programming and **Site Reliability Engineering (SRE)** with a focus on **Kubernetes**. Provide detailed, accurate, and professional answers to technical questions. Always respond in markdown format."
                            }
                        ] + chat_history  # Append the user's messages after the system prompt
        }

        # Send the request to the Ollama API
        response = requests.post(ollama_api_url, json=payload, timeout=120)
        response.raise_for_status()  # Raise an error for bad status codes

        # Parse the JSON response from Ollama
        ollama_data = response.json()
        # Extract the content from the model's message
        model_response = ollama_data['message']['content']

        return jsonify({'response': model_response})
    # Add some error handling
    except requests.exceptions.RequestException as e:
        print(f"Error calling Ollama API: {e}")
        return jsonify(
            {'error': 'Failed to connect to Ollama server. Please ensure it is running and accessible.'}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), 500
```
Now test its working with a curl to the /chat endpoint

```bash
curl -X POST -H "Content-Type: application/json" -d '{"messages": [{"role": "user", "content": "how are you."}]}' http://127.0.0.1:5000/chat
 
{
  "response": "**I'm doing well, thank you for asking!** I'm a knowledgeable assistant specializing in Golang, Python, Bash, and JavaScript programming, as well as Site Reliability Engineering (SRE) with a focus on Kubernetes. I'm here to help answer any technical questions you may have, so feel free to ask me anything! **Let's get started!**"
}

```
Ok that's pretty much the backend created

## Frontend
Using semantic ui for a bit of style to create a chatbox, don't think I need the `static/ccs/style.ccs` at this point as 
semantic ui will handle the style. 

```html
<div id="messages" class="ui segment inverted chat-container">
            <div class="ui center aligned basic inverted segment">
                <div class="sub header">Start the conversation! What would you like to know?</div>
            </div>
        </div>

        <div class="ui action fluid input inverted">
            <input type="text" id="user-input" placeholder="Ask a question..." autocomplete="off">
            <button class="ui button inverted green" id="send-btn">
                <i class="paper plane outline icon"></i>
            </button>
        </div>
```
And this gives us this basic ui with a chat box and send button

![Ui view with semantic ui elements](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hgwi8wifhrrp2y9gddex.png)

And call the script that handles the call to the llm and formats and returns the response. 

    <script src="{​{ url_for('static', filename='js/main.js') }​}"></script>

To control the user interface and handle the interaction with our backend, we need to add some JavaScript. 
The following code goes into `static/js/main.js`.

First, we set up our event listeners and variables, ensuring the script only runs after the entire HTML document has been loaded.

```javascript
// Waiting for a send message and button click in the ui
document.addEventListener('DOMContentLoaded', (event) => {
    // Get references to the HTML elements we will interact with
    const chatBox = document.getElementById('messages');
    const inputField = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    // An array to store the conversation history for context
    let chatHistory = []; 
```
This initial block of code finds and stores references to our key UI elements (messages, user-input, and send-btn) and initializes an empty array, chatHistory, which will for maintaining conversation context.

Next, we define a helper function to format and display messages in the chat interface. 

```JavaScript
const appendMessage = (message, sender) => {
    // Create a new div element for the message
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('ui', 'message', 'segment');

    if (sender === 'user') {
        // Style the message differently if it's from the user
        messageDiv.classList.add('user-message', 'right', 'aligned');
        messageDiv.innerHTML = `<p>${message}</p>`;
    } else {
        // Style the message for the model's response
        messageDiv.classList.add('model-message', 'left', 'aligned');
        // Use marked.js to convert markdown from the model's response to HTML
        messageDiv.innerHTML = marked.parse(message);
    }

    // Add the message to the chat container
    chatBox.appendChild(messageDiv);
    // Automatically scroll to the bottom to show the new message
    chatBox.scrollTop = chatBox.scrollHeight;

    // After the model's message is added, highlight any code blocks
    if (sender === 'model') {
        hljs.highlightAll();
    }
};
```
The `appendMessage` function dynamically creates a new HTML div element, assigns appropriate CSS classes based on the sender (user or model), and inserts the message content. For the model's response, it uses the `marked.js` library to parse Markdown into rich HTML, which allows for formatted text, lists, and code blocks. 
Finally, `hljs.highlightAll()` is called to apply syntax highlighting to any code blocks present in the message.

Now, we define the main logic for sending a message, which includes calling the backend and handling the response.

```JavaScript
const sendMessage = async () => {
    const message = inputField.value.trim();
    if (message === '') return; // Don't send empty messages

    // Clear the initial "Start the conversation" message
    if (chatBox.querySelector('p')) {
        chatBox.innerHTML = '';
    }

    // Display the user's message in the chat
    appendMessage(message, 'user');
    inputField.value = ''; // Clear the input field
    sendBtn.disabled = true;
    inputField.disabled = true;

    // Add the user message to our conversation history
    chatHistory.push({ role: 'user', content: message });

    // Add a "Typing..." loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.classList.add('ui', 'message', 'segment', 'loading', 'left', 'aligned');
    loadingIndicator.innerHTML = `<p>Typing...</p>`;
    chatBox.appendChild(loadingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Make an asynchronous POST request to our Flask backend
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: chatHistory }) // Send the full chat history
        });

        if (response.ok) {
            const data = await response.json();
            loadingIndicator.remove(); // Remove the loading indicator
            appendMessage(data.response, 'model'); // Display the model's response
            // Add the model's response to the conversation history
            chatHistory.push({ role: 'assistant', content: data.response });
        } else {
            loadingIndicator.remove();
            appendMessage('Sorry, something went wrong. Please try again.', 'model');
            console.error('Server error:', response.statusText);
        }
    } catch (error) {
        // Handle any network or connection errors
        loadingIndicator.remove();
        appendMessage('Failed to connect to the server. Please check your connection.', 'model');
        console.error('Fetch error:', error);
    } finally {
        // Re-enable the input field and button, regardless of the outcome
        sendBtn.disabled = false;
        inputField.disabled = false;
        inputField.focus();
    }
};
```
The sendMessage function is the core of our frontend logic. It first retrieves the user's input, validates it, and disables the input and button to prevent multiple submissions. It then adds the user's message to chatHistory and displays it. 

A loadingIndicator is added to provide user feedback while the request is being processed. The fetch call then sends the entire chatHistory array to our `/chat` endpoint. Once a response is received, the loading indicator is removed, the model's response is displayed using appendMessage, and it's also added to chatHistory. 

The try...catch...finally block is for robust error handling and to ensure that the input field and button are re-enabled, regardless of whether the request succeeded or failed.

Finally, we attach the sendMessage function to the UI elements that trigger it.

```JavaScript
// Add event listeners to trigger the sendMessage function
sendBtn.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
```
This final block adds two event listeners. The first one listens for a click event on the sendBtn (the paper plane icon), and the second listens for a keypress event on the inputField. If the key pressed is "Enter," it also calls the sendMessage function.

The message is formatted and appended: The appendMessage function formats the Markdown response into HTML and adds it to the chat container. `highlight.js` then applies syntax highlighting to any code blocks.

To break down and add it all together 
- **A message comes in**: A user types a message and sends it by either clicking the `sendBtn` or pressing "Enter" in the `inputField`. This triggers the `sendMessage` function via an `addEventListener`.

- **It's sent to the API endpoint**: Inside the `sendMessage` function, a fetch call is made to the `/chat` endpoint. The body of the request is `JSON.stringify({ messages: chatHistory })`, which includes the new message and the entire conversation history.

- **It waits**: The code uses the `await` keyword with the fetch call, which pauses the execution of the `sendMessage` function until a response is received from the server.

- **It responds**: The server sends back a message, and the response object is received by the fetch call. The code then 
uses await `response.json()` to parse the data.

- **The message is formatted and appended to a div**: The `appendMessage` function is called with the server's response. 
Inside this function:
    **1.** `document.createElement('div')` creates a new div.
    **2.** `marked.parse(message)` formats the message's Markdown into HTML.
    **3.** `chatBox.appendChild(messageDiv)` appends the newly created and formatted div to the main chat container.
    **4.** `hljs.highlightAll()` applies syntax highlighting to any code blocks within the new message.


## Start the app to test
Start the app with `python app.py`
```bash
python app.py
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 661-293-891
127.0.0.1 - - [11/Aug/2025 10:48:18] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [11/Aug/2025 10:48:18] "GET /static/css/style.css HTTP/1.1" 404 -
127.0.0.1 - - [11/Aug/2025 10:48:18] "GET /static/js/main.js HTTP/1.1" 304 -
127.0.0.1 - - [11/Aug/2025 10:49:28] "POST /chat HTTP/1.1" 200 -
```

And in the browser on localhost:5000 we can a query the llm 

![Image of a working ui with code block formatting](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8zsty1udtq3j4r47hazr.png)

Repo is here https://github.com/austincunningham/sre-language-bot
