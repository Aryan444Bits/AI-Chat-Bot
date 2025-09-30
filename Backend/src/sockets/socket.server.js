const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiService = require('../services/ai.service')
const messageModel = require('../models/message.model')
const { creatememory, queryMemory } = require('../services/vector.service')

function initSocketServer(httpServer) {

    const io = new Server(httpServer, {})

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            next(new Error("Authentication error : No Token Provided"))
        }

        try {

            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)

            const user = await userModel.findById(decoded.id);

            socket.user = user;

            next();

        } catch (error) {
            next(new Error("Authentication error: Invalid Token"))
        }
    })

    io.on("connection", (socket) => {

        socket.on('ai-message', async (messagePayload) => {

            // message store in database and creating vectors of user message
            const [message, vectors] = await Promise.all([

                // save the user message in database
                messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user.id,
                    content: messagePayload.content,
                    role: "user"
                }),

                // generating the vector of the user messsage
                aiService.generateVector(messagePayload.content),
            ])

            // storing the vector in the vector database pinecone
            await 
                creatememory({
                    vectors,
                    messageId: message._id,
                    metadata: {
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        text: messagePayload.content
                    }
                })


            // here we are querying the users message in vector database to find the similar messages and also geting the user chatHistory froom the database 
            const [memory, chatHistory] = await Promise.all([

                // querying in vector database
                queryMemory({
                    queryVector: vectors,
                    limit: 3,
                    metadata: {
                        metadata: socket.user._id
                    }
                }),

                // getting the user chat hsitory from the database
                messageModel.find({
                    chat: messagePayload.chat
                }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse())
            ])

            // puri chat history ai ko di jaati h for generating response

            const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            })

            const ltm = [
                {
                    role: "user",
                    parts: [{
                        text: `
                        these are the previous messages from the chat, use them to generate a response

                        ${memory.map(item => item.metadata.text).join("\n")}
                        `}]
                }
            ]

            const response = await aiService.generateResponse([...ltm, ...stm])


            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })


            // here we saving the response of ai in database and converting that response in vectors also
            const [responseMessage, responseVectors] = await Promise.all([

                // saving reponse in database
                messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user.id,
                    content: response,
                    role: "model"
                }),

                // generating vectors of response
                aiService.generateVector(response)
            ])


            // save ai response vaector in vector database
            await creatememory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                }
            })
        })
    })
}




module.exports = initSocketServer