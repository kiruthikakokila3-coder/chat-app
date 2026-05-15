const socket = io();
let myMode = "";

function connect() {
    const name = document.getElementById('name').value;
    myMode = document.getElementById('mode').value;
    
    if(name) {
        socket.emit('join', { name, mode: myMode });
        document.getElementById('login').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
    }
}

function send() {
    const msg = document.getElementById('m').value;
    socket.emit('chatMessage', msg);
    document.getElementById('m').value = '';
}

socket.on('messageDisplay', (data) => {
    const div = document.createElement('div');
    // Neenga keta logic: Public na left, Private na right
    div.className = `msg ${data.mode === 'public' ? 'left' : 'right'}`;
    div.innerHTML = `<b>${data.user}:</b> ${data.text}`;
    document.getElementById('msgBox').appendChild(div);
});