const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// 'public' folder-la irukura static files-a server-ku theriyapaduthuroam
app.use(express.static(path.join(__dirname, 'public')));

// Main URL open panna 'public/chat.html' anuppum
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.userName = data.name;
        socket.mode = data.mode;
        console.log(`${socket.userName} connected in ${socket.mode} mode`);
    });

    socket.on('chatMessage', (msg) => {
        io.emit('messageDisplay', {
            user: socket.userName,
            text: msg,
            mode: socket.mode
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});