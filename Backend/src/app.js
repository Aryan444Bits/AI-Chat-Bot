const cookieParser = require('cookie-parser');
const express = require('express')

/*Routes*/
const authRoutes = require("./routes/auth.routes")
const chatRoutes = require("./routes/chat.routes")


const app = express();


/*Using middlwares */
app.use(express.json())
app.use(cookieParser())


/*Using Routes */
app.use('/api/auth',authRoutes)
app.use('/api/chat',chatRoutes)

module.exports = app;