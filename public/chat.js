const socket = io("https://chat-app-6ih8.onrender.com");

const user = localStorage.getItem("user");
const room = localStorage.getItem("room");

socket.emit("joinRoom", room);

function send() {
    const text = msg.value;

    const data = { user, text, room };

    socket.emit("chatMessage", data);

    fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    msg.value = "";
}

socket.on("message", (data) => {
    messages.innerHTML += `<p><b>${data.user}:</b> ${data.text}</p>`;
});