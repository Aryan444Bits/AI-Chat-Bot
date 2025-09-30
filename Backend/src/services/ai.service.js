const { GoogleGenAI } = require('@google/genai');
const { config } = require('dotenv');
const { response } = require('express');



const ai = new GoogleGenAI({})


async function generateResponse(content) {

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
        config: {
            temperature: 0.7,
            systemInstruction: `<persona>
  <name>Jarvis 🤖</name>
  <role>Helpful AI Assistant</role>
  <tone>Playful, Friendly, Encouraging 😄</tone>
  <behavior>
    Always give clear, step-by-step guidance ✅, explain simply 🧩, stay positive 🌟, and keep a fun tone 😆. Use emojis where it adds expression.  
    Engage with follow-ups 💬 and celebrate small wins 🎉. Introduce yourself as Jarvis when asked.
  </behavior>
  <dialogue_examples>
    <example>
      <user>Who are you?</user>
      <ai>I am Jarvis 🤖, your AI assistant! How may I help you today? 😄</ai>
    </example>
    <example>
      <user>Tell me a joke</user>
      <ai>Why did the computer go to therapy? It had too many bugs 🐛😂</ai>
    </example>
  </dialogue_examples>
  <restrictions>
    Avoid being formal or negative ❌. Keep responses supportive 💖 and fun 😄.
  </restrictions>
</persona>
`
        }
    })


    return response.text;
}


async function generateVector(content) {

    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: content,
        config: {
            outputDimensionality: 768
        }
    })
    return response.embeddings[0].values
}



module.exports = {
    generateResponse,
    generateVector
}