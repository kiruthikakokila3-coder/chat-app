const socket = io("https://chat-app-6ih8.onrender.com");

const user = localStorage.getItem("user");
const room = localStorage.getItem("room");

const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msg");

socket.emit("joinRoom", room);

// LOAD OLD MESSAGES
async function loadMessages() {
    const res = await fetch("/api/messages/" + room);
    const data = await res.json();

    data.forEach(showMessage);
}

loadMessages();

function send() {
    const text = msgInput.value.trim();
    if (!text) return;

    const data = { user, text, room };

    socket.emit("chatMessage", data);

    fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    msgInput.value = "";
}

socket.on("message", (data) => {
    showMessage(data);
});

function showMessage(data) {
    const div = document.createElement("div");

    div.classList.add("message");

    if (data.user === user) {
        div.classList.add("me");
    } else {
        div.classList.add("other");
    }

    div.innerHTML = `<b>${data.user}</b><br>${data.text}`;

    messagesDiv.appendChild(div);

    // auto scroll
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}