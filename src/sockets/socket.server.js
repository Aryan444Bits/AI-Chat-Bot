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

            // message store in database
            const message = await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user.id,
                content: messagePayload.content,
                role: "user"
            })

            // generating the vectors from ai-embeddings of user messages
            const vectors = await aiService.generateVector(messagePayload.content)

            const memory = await queryMemory({
                queryVector: vectors,
                limit: 3,
                metadata: {
                    metadata:socket.user._id
                }
            })

            // creating memory in vector databse to stroe the vectors
            await creatememory({
                vectors,
                messageId: message._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                }
            })

            // we set the chat history of ai
            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({ createdAt: -1 }).limit(20).lean()).reverse()

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

            console.log(ltm[0]);
            console.log(stm);

            const response = await aiService.generateResponse([...ltm, ...stm])

            // store the ai-response in database
            const responseMessage = await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user.id,
                content: response,
                role: "model"
            })

            // converting the ai-response in vector
            const responseVectors = await aiService.generateVector(response)

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


            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })
        })
    })
}




module.exports = initSocketServer