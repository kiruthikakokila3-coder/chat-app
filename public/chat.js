const API = "https://chat-app-6ih8.onrender.com";
const socket = io(API);

let myId = localStorage.getItem("userId");
let token = localStorage.getItem("token");
let currentUser = null;

// 🔐 JOIN
socket.emit("join", myId);

// 📥 LOAD USERS
async function loadUsers() {
  const res = await fetch(API + "/api/users", {
    headers: { Authorization: "Bearer " + token },
  });

  const users = await res.json();
  const div = document.getElementById("users");
  div.innerHTML = "";

  users.forEach((u) => {
    if (u._id === myId) return;

    const el = document.createElement("div");
    el.className = "user";
    el.innerText = u.name;

    el.onclick = () => openChat(u);

    div.appendChild(el);
  });
}

loadUsers();

// 💬 OPEN CHAT
async function openChat(user) {
  currentUser = user;

  const res = await fetch(
    API + "/api/messages/private/" + user._id,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );

  const msgs = await res.json();

  const box = document.getElementById("messages");
  box.innerHTML = "";

  msgs.forEach((m) => addMessage(m));
}

// ➕ ADD MESSAGE
function addMessage(m) {
  const div = document.createElement("div");

  const isMe = m.sender === myId;

  div.className = "msg " + (isMe ? "me" : "other");
  div.innerText = m.message;

  document.getElementById("messages").appendChild(div);

  scrollBottom();
}

// 📤 SEND
function sendMsg() {
  const input = document.getElementById("msgInput");
  const text = input.value;

  if (!text || !currentUser) return;

  socket.emit("sendMessage", {
    sender: myId,
    receiver: currentUser._id,
    message: text,
  });

  addMessage({ sender: myId, message: text });

  input.value = "";
}

// 📩 RECEIVE
socket.on("newMessage", (msg) => {
  if (msg.sender === currentUser?._id) {
    addMessage(msg);
  }
});

// 🔽 SCROLL
function scrollBottom() {
  const div = document.getElementById("messages");
  div.scrollTop = div.scrollHeight;
}