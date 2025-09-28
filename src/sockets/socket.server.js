const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiService = require('../services/ai.service')
const messageModel = require('../models/message.model')
const {creatememory, queryMemory} = require('../services/vector.service')

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

            const message = await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user.id,
                content: messagePayload.content,
                role: "user"
            })

            // generating the vectors from ai-embeddings
            const vectors = await aiService.generateVector(messagePayload.content)

            const memory = await queryMemory({
                queryVector:vectors,
                limit:3,
                metadata:{}
            })

            await creatememory({
                vectors,
                messageId:message._id,
                metadata:{
                    chat:messagePayload.chat,
                    user:socket.user._id,
                    text:messagePayload.content
                }
            })

            console.log(memory);


            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({createdAt: -1}).limit(20).lean()).reverse()

            const response = await aiService.generateResponse(chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            }))

            const responseMessage = await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user.id,
                content: response,
                role: "model"
            })

            const responseVectors = await aiService.generateVector(response)

            await creatememory({
                vectors:responseVectors,
                messageId:responseMessage._id,
                metadata:{
                    chat:messagePayload.chat,
                    user:socket.user._id,
                    text:response
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