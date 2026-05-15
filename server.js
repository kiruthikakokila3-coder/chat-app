const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {

    socket.on('join', (data) => {
        socket.userName = data.name;

        // ✅ FIX: trim password (MAIN BUG FIX)
        socket.room = data.password.trim();

        socket.mode = data.mode;

        socket.join(socket.room);

        console.log(`${socket.userName} joined room: ${socket.room}`);
    });

    socket.on('chatMessage', (msg) => {
        io.to(socket.room).emit('messageDisplay', {
            user: socket.userName,
            text: msg,
            mode: socket.mode
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));