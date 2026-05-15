const socket = io();
let currentMode = "";

function startChat() {
    const name = document.getElementById('username').value;

    // ✅ FIX: trim password (MAIN FIX)
    const pass = document.getElementById('password').value.trim();

    const mode = document.getElementById('chat-mode').value;

    if (name && pass) {

        currentMode = mode;

        socket.emit('join', {
            name: name,
            mode: mode,
            password: pass
        });

        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-dashboard').style.display = 'block';

        document.getElementById('user-display').innerText = name;

    } else {
        alert("Name and Password required");
    }
}

function sendMsg() {
    const msg = document.getElementById('msg-input').value;

    if (msg) {
        socket.emit('chatMessage', msg);
        document.getElementById('msg-input').value = '';
    }
}

socket.on('messageDisplay', (data) => {
    const box = document.getElementById('message-container');

    const div = document.createElement('div');

    const side = (data.mode === 'public') ? 'left' : 'right';

    div.innerHTML = `<b>${data.user}</b>: ${data.text}`;
    box.appendChild(div);
});