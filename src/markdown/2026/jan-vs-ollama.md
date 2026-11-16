# Is Jan.ai a replacement for Ollama?
![](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/aikw8iyy1xqxoqpqfctv.png)

## Install

Moved to a new laptop and Ollama wasn't performing great so decided to look for an alternative. After a quick search I found Jan.ai. Installation with flatpak, and was up and running in a few moments.
```bash
flatpak install flathub ai.jan.Jan
flatpak run ai.jan.Jan
```
On startup you're asked to install the default model `Jan-v3.5-4B` and you get a UI chatbot.
![chatbot Image](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/7cbr8tf24xivu93pl5qc.png)

Getting started was similar to Ollama.

## Adding other models
Like Ollama you can install other models from the Hub

![hub screenshot](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/33efq564m4yqp6nopqmw.gif)

## Running Jan.ai as a local API endpoint
Like Ollama you can expose Jan.ai via API for developing your own AI POC. 
Jan.ai includes a local API server. In Jan, go to Settings → Local API Server, choose the model, and click Start Server. 

![enable API Server image](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/j73ovp1po8mdglgui5nx.gif)

The default address is http://127.0.0.1:1337/v1. You can set an API key in the server settings, if you leave it blank, omit the authorization header. From a terminal you can curl, or access it in code.

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "YOUR_MODEL_ID",
    "messages": [{"role": "user", "content": "Explain this code."}]
  }'
```
## GPU access
One extra thing I installed was Vulkan. Vulkan basically gives you access to the laptop Intel GPU to improve the model's performance locally.

![jan ai settings](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/ahxtj6zpalj3w087jk2u.png)

It's installed as follows on Fedora.
```bash
sudo dnf install mesa-vulkan-drivers vulkan-tools
# Test
vulkaninfo --summary
```
This worked out of the box for Jan.ai. I wasn't able to get Vulkan working for Ollama, I believe it relies on an env var `OLLAMA_VULKAN=1` but didn't see any improvement with the env var set. 

## Summary
- All of the Ollama functionality I use is present. 
- The user interface was an improvement with Jan.ai. 
- There is extra functionality avaliable with Jan.ai like setting up a proxy for external access or allowing web access to the chatbot, neither of these are avaliable in Ollama. 
- I tried a few of the same models for example qwen3.8b. Jan.ai was a lot quicker overall for simple chats. It was not even close.
- Jan.ai Hub has a lot of models, I notice models like `mistral` were missing. 

But in answer my question yes it is a good replacement.  
