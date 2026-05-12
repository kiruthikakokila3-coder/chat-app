const socket = io();

const params = new URLSearchParams(window.location.search);
const type = params.get("type") || "public";

let username = "";
let room = type + "-room";

document.getElementById("title").innerText =
  type.toUpperCase() + " CHAT";

// JOIN
function join() {
  username = document.getElementById("name").value;
  const pass = document.getElementById("pass").value;

  if (!username || !pass) {
    alert("Enter name & password");
    return;
  }

  socket.emit("join_secure_room", {
    type,
    password: pass,
    username
  });
}

// ACCESS
socket.on("access_granted", () => {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("chatUI").style.display = "block";
});

socket.on("access_denied", () => {
  alert("Wrong password ❌");
});

// SEND
function send() {
  const msg = document.getElementById("msg").value;
  if (!msg) return;

  socket.emit("room_message", {
    room,
    message: msg,
    from: username
  });

  document.getElementById("msg").value = "";
}

// RECEIVE
socket.on("room_message", (data) => {
  const chat = document.getElementById("chat");

  const div = document.createElement("div");
  div.className = "msg " + (data.from === username ? "me" : "");
  div.innerHTML = `<b>${data.from}</b>: ${data.message}`;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// TYPING
function typingEvent() {
  socket.emit("typing", { user: username, room });
}

socket.on("typing", (data) => {
  const typing = document.getElementById("typing");

  typing.innerText = data.user + " is typing...";

  setTimeout(() => {
    typing.innerText = "";
  }, 1000);
});

// ONLINE USERS
socket.on("online_users", (users) => {
  document.getElementById("onlineUsers").innerText =
    "Online: " + users.join(", ");
});