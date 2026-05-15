const socket = io();
let currentMode = "";

function startChat() {
    const name = document.getElementById('username').value;
    currentMode = document.getElementById('chat-mode').value;

    if (name) {
        socket.emit('join', { name: name, mode: currentMode });
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-dashboard').style.display = 'flex';
        document.getElementById('user-display').innerText = `${name} (${currentMode})`;
    } else {
        alert("Please enter your name");
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
    
    // Logic: Public = Left, Private = Right
    const sideClass = (data.mode === 'public') ? 'msg-left' : 'msg-right';
    
    div.className = `message ${sideClass}`;
    div.innerHTML = `<strong>${data.user}:</strong> <br> ${data.text}`;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
});