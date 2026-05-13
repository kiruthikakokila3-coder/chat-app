const socket = io();

const user = localStorage.getItem("user");
const room = "global";

socket.emit("joinRoom", room);

function send() {
  const text = msg.value;

  const data = { sender: user, text, room };

  socket.emit("sendMessage", data);

  fetch("/api/messages", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });

  msg.value = "";
}

socket.on("newMessage", (data) => {
  messages.innerHTML += `<p><b>${data.sender}</b>: ${data.text}</p>`;
});