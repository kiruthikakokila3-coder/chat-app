const socket = io();
let currentMode = "";

function startChat() {
    const name = document.getElementById('username').value;
    const mode = document.getElementById('chat-mode').value;
    const pass = document.getElementById('password').value;

    if (name && pass) {
        currentMode = mode;
        socket.emit('join', { name: name, mode: mode, password: pass });
        
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-dashboard').style.display = 'flex';
        document.getElementById('user-display').innerText = name;
    } else {
        alert("Name and Password are required!");
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
    const msgBox = document.getElementById('message-container');
    const div = document.createElement('div');
    
    // Public = Left side, Private = Right side
    const sideClass = (data.mode === 'public') ? 'msg-left' : 'msg-right';
    
    div.className = `message ${sideClass}`;
    div.innerHTML = `<strong>${data.user}</strong><br>${data.text}`;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
});