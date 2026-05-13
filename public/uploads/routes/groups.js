const API = "https://chat-app-6ih8.onrender.com";
const socket = io(API);

let myId = localStorage.getItem("userId");
let token = localStorage.getItem("token");
let currentRoom = null;

// 🔐 JOIN
socket.emit("join", myId);

// 📥 LOAD GROUPS
async function loadGroups() {
  const res = await fetch(API + "/api/groups", {
    headers: { Authorization: "Bearer " + token },
  });

  const groups = await res.json();
  const div = document.getElementById("groups");

  div.innerHTML = "";

  groups.forEach((g) => {
    const el = document.createElement("div");
    el.className = "group";
    el.innerText = g.name;

    el.onclick = () => openGroup(g._id, g.name);

    div.appendChild(el);
  });
}

loadGroups();

// ➕ CREATE GROUP
async function createGroup() {
  const name = document.getElementById("groupName").value;

  await fetch(API + "/api/groups/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ name, members: [] }),
  });

  document.getElementById("groupName").value = "";
  loadGroups();
}

// 💬 OPEN GROUP
async function openGroup(roomId, name) {
  currentRoom = roomId;

  socket.emit("joinRoom", roomId);

  const msgDiv = document.getElementById("messages");
  msgDiv.innerHTML = `<h3>${name}</h3>`;

  const res = await fetch(
    API + "/api/messages/group/" + roomId,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );

  const messages = await res.json();

  messages.forEach((m) => addMessage(m));
}

// ➕ ADD MESSAGE
function addMessage(m) {
  const div = document.createElement("div");

  const isMe = m.sender === myId || m.sender?._id === myId;

  div.className = "msg " + (isMe ? "me" : "other");
  div.innerText = m.message;

  document.getElementById("messages").appendChild(div);

  scrollBottom();
}

// 📤 SEND
function sendMsg() {
  const input = document.getElementById("msgInput");
  const text = input.value;

  if (!text || !currentRoom) return;

  socket.emit("sendMessage", {
    sender: myId,
    roomId: currentRoom,
    message: text,
  });

  addMessage({ sender: myId, message: text });

  input.value = "";
}

// 📩 RECEIVE
socket.on("newMessage", (msg) => {
  if (msg.roomId === currentRoom) {
    addMessage(msg);
  }
});

// 🔽 SCROLL
function scrollBottom() {
  const div = document.getElementById("messages");
  div.scrollTop = div.scrollHeight;
}