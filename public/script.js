const socket = io();

const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const typingDiv = document.getElementById("typing");
const onlineDiv = document.getElementById("online");

let user = localStorage.getItem("user");
let room = localStorage.getItem("room");

socket.emit("login", user);
socket.emit("joinRoom", { username: user, room });

function scrollBottom(){
  chat.scrollTop = chat.scrollHeight;
}

function send(){
  if(msg.value === "") return;

  socket.emit("sendMessage", {
    room,
    user,
    text: msg.value
  });

  msg.value = "";
}

socket.on("message", (data) => {
  const div = document.createElement("div");

  div.classList.add("message");
  div.classList.add(data.user === user ? "sent" : "received");

  div.innerHTML = `<b>${data.user}</b><br>${data.text}`;

  chat.appendChild(div);
  scrollBottom();

  socket.emit("seen", { room, user });
});

msg.addEventListener("input", () => {
  socket.emit("typing", { room, user });
});

socket.on("typing", (u) => {
  typingDiv.innerText = u + " typing...";
  setTimeout(() => typingDiv.innerText = "", 2000);
});

socket.on("status", (msg) => {
  const div = document.createElement("div");
  div.innerHTML = `<i>${msg}</i>`;
  chat.appendChild(div);
});

socket.on("onlineUsers", (users) => {
  onlineDiv.innerText = "Online: " + users.join(", ");
});