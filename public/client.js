const socket = io();
const username = localStorage.getItem("username");

function sendMsg() {
  const input = document.getElementById("msg");
  const msg = input.value;
  if(!msg) return;

  socket.emit("chat message", username + ": " + msg);
  input.value = "";
}

socket.on("chat message", (msg) => {
  const li = document.createElement("li");
  li.textContent = msg;
  document.getElementById("messages").appendChild(li);
});