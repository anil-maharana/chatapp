const express = require('express');
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require('./config/db');
const jwt = require("jsonwebtoken");

// set up server and express
const app = express();
const httpServer = http.createServer(app)
const PORT = process.env.PORT || 5000;

//connect db
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}))



//create socket IO
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*"
    }
});
io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        try {
            jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET,
                function (error, decoded) {
                    if (error) return next(new Error("Authentication Error"));
                    socket.decoded = decoded;
                    next();
                });
        } catch (error) {
            next(new Error("Something went wrong. "))
        }
    }
    else {
        next(new Error("Invalid Token, Authentication Error"))
    }
}).on('connection', async (socket) => {
    const { user } = socket.decoded;
    const rooms = await (await require('./models/roomModal').find({ users: { $in: [user.id] } })).map(_room => _room._id.toString());
    socket.join(rooms);
    console.log(`socket is connected, ID: ${socket.id} and userId: ${user.id} and joined rooms are ${rooms.join(', ')}`);


    socket.on('send-message', ({ message, author, room }, cb) => {//event emitter -node 
        socket.to(room._id).emit('received-message', { message, author, room }); // to all clients in room1 except the sender
        socket.broadcast.emit('new-message-notification', { roomID: room._id, message: 'New message received' });// to all clients in the current namespace except the sender
        cb();
    })
    socket.on("disconnect", () => {
        console.log("socket is disconnected");
    });
});

//Define routes
app.use('/api/users', require('./routes/api/userRouter'))
app.use('/api/auth', require('./routes/api/authRouter'))
app.use('/api/rooms', require('./routes/api/roomRouter'))
app.use('/api/messages', require('./routes/api/messageRouter'))


httpServer.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});