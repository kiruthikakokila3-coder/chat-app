const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.userName = data.name;
        socket.mode = data.mode;
        console.log(`${socket.userName} joined in ${socket.mode} mode`);
    });

    socket.on('chatMessage', (msg) => {
        // Public na ellarkum pogum, Private na selective-aa handle pannalam
        io.emit('messageDisplay', {
            user: socket.userName,
            text: msg,
            mode: socket.mode
        });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));