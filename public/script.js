const socket = io();

const name = localStorage.getItem("name");
const dp = localStorage.getItem("dp");
const to = localStorage.getItem("chatUser");

socket.emit("join", { username: name, dp });

// SEND MESSAGE
function send() {
  const msg = document.getElementById("msg").value;

  socket.emit("message", {
    name,
    msg,
    dp,
    to
  });

  document.getElementById("msg").value = "";
}

// RECEIVE MESSAGE
socket.on("message", (data) => {

  const isMe = data.name === name;

  const div = document.createElement("div");
  div.className = isMe ? "me" : "other";

  div.innerHTML = `
    <div class="bubble">
      <img src="${data.dp}" width="30">
      ${data.msg}
    </div>
  `;

  const box = document.getElementById("messages");
  box.appendChild(div);

  box.scrollTop = box.scrollHeight;
});

// TYPING
document.getElementById("msg").addEventListener("input", () => {
  socket.emit("typing", to);
});

socket.on("typing", (user) => {
  document.getElementById("typing").innerText = user + " typing...";
  setTimeout(() => {
    document.getElementById("typing").innerText = "";
  }, 1000);
});

// SEEN
socket.on("seen", () => {
  console.log("✔✔ Seen");
});

// ONLINE USERS
socket.on("onlineUsers", (list) => {
  console.log("Online:", list);
});