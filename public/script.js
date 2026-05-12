const socket = io();

const username = localStorage.getItem("username");
socket.emit("join", username);

let selectedUser = "";

const usersList = document.getElementById("users");
const messagesDiv = document.getElementById("messages");
const chatWith = document.getElementById("chatWith");

// ONLINE USERS
socket.on("onlineUsers", (users) => {
  usersList.innerHTML = "";

  users.forEach((user) => {
    if (user !== username) {
      const li = document.createElement("li");
      li.innerText = user;
      li.onclick = () => selectUser(user);
      usersList.appendChild(li);
    }
  });
});

// SELECT USER
function selectUser(user) {
  selectedUser = user;
  chatWith.innerText = "Chat with " + user;
  messagesDiv.innerHTML = "";
}

// SEND MESSAGE
function sendMessage() {
  const input = document.getElementById("message");
  const message = input.value;

  if (!selectedUser) {
    alert("Select user first");
    return;
  }

  socket.emit("privateMessage", {
    to: selectedUser,
    message,
    from: username,
  });

  addMessage("You", message);
  input.value = "";
}

// RECEIVE MESSAGE
socket.on("privateMessage", ({ message, from }) => {
  addMessage(from, message);
});

// ADD MESSAGE UI
function addMessage(sender, msg) {
  const div = document.createElement("div");
  div.className = sender === "You" ? "me" : "other";
  div.innerHTML = `<b>${sender}:</b> ${msg}`;
  messagesDiv.appendChild(div);
}

// TYPING
document.getElementById("message").addEventListener("input", () => {
  if (selectedUser) {
    socket.emit("typing", { to: selectedUser, from: username });
  }
});

socket.on("typing", (user) => {
  document.getElementById("typing").innerText = user + " typing...";

  setTimeout(() => {
    document.getElementById("typing").innerText = "";
  }, 1000);
});