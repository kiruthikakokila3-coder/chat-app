const socket = io("http://localhost:3000");

let myId = localStorage.getItem("userId");
let token = localStorage.getItem("token");
let currentChatUser = null;

// 🔐 JOIN USER
socket.emit("join", myId);

// 📥 LOAD USERS
async function loadUsers() {
  const res = await fetch("http://localhost:3000/api/users", {
    headers: { Authorization: "Bearer " + token },
  });

  const users = await res.json();
  const usersDiv = document.getElementById("users");

  usersDiv.innerHTML = "";

  users.forEach((u) => {
    const div = document.createElement("div");
    div.className = "user";
    div.innerText = u.name;

    div.onclick = () => openChat(u._id, u.name);

    usersDiv.appendChild(div);
  });
}

loadUsers();

// 💬 OPEN CHAT
async function openChat(userId, name) {
  currentChatUser = userId;

  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = `<h3>${name}</h3>`;

  const res = await fetch(
    `http://localhost:3000/api/messages/private/${userId}`,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );

  const messages = await res.json();

  messages.forEach((m) => addMessage(m));

  scrollBottom();
}

// ➕ ADD MESSAGE
function addMessage(m) {
  const div = document.createElement("div");

  const isMe = m.sender === myId;

  div.className = "msg " + (isMe ? "me" : "other");

  let text = m.deleted ? "🚫 Message deleted" : m.message;

  if (m.edited) text += " ✏️";

  div.innerText = text;

  document.getElementById("messages").appendChild(div);

  scrollBottom();
}

// 📤 SEND MESSAGE
function sendMsg() {
  const input = document.getElementById("msgInput");
  const text = input.value.trim();

  if (!text || !currentChatUser) return;

  socket.emit("sendMessage", {
    sender: myId,
    receiver: currentChatUser,
    message: text,
  });

  input.value = "";
}

// ⌨️ TYPING
const inputBox = document.getElementById("msgInput");

inputBox.addEventListener("input", () => {
  socket.emit("typing", { userId: myId });
});

socket.on("typing", (userId) => {
  if (userId === currentChatUser) {
    showTyping();
  }
});

function showTyping() {
  let typingDiv = document.getElementById("typing");

  if (!typingDiv) {
    typingDiv = document.createElement("div");
    typingDiv.id = "typing";
    typingDiv.innerText = "Typing...";
    typingDiv.style.color = "#aaa";
    document.getElementById("messages").appendChild(typingDiv);
  }

  setTimeout(() => {
    if (typingDiv) typingDiv.remove();
  }, 1000);
}

// 📩 RECEIVE MESSAGE
socket.on("newMessage", (msg) => {
  if (
    msg.sender === currentChatUser ||
    msg.receiver === currentChatUser
  ) {
    addMessage(msg);
  }
});

// 👁 SEEN
socket.on("messageSeen", (id) => {
  console.log("Seen:", id);
});

// ❤️ REACTION
socket.on("reactionUpdate", (data) => {
  console.log("Reaction:", data);
});

// ✏️ EDIT
socket.on("messageEdited", (msg) => {
  console.log("Edited:", msg);
});

// 🗑 DELETE
socket.on("messageDeleted", (id) => {
  console.log("Deleted:", id);
});

// 🔽 AUTO SCROLL
function scrollBottom() {
  const div = document.getElementById("messages");
  div.scrollTop = div.scrollHeight;
}