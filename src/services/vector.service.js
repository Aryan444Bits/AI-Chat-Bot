// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const AIChatBot = pc.Index('ai-chat-bot')


async function creatememory({ vectors, metadata, messageId }){

    await AIChatBot.upsert([{
        id:messageId,
        values:vectors,
        metadata
    }])
}


async function queryMemory({ queryVector, limit=3, metadata}){

    const data = await AIChatBot.query({
        vector:queryVector,
        topK:limit,
        filter:metadata ? metadata : undefined,
        includeMetadata:true
    })

    return data.matches
}


module.exports = { creatememory, queryMemory}