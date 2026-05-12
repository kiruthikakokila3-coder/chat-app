const socket = io();

const username = localStorage.getItem("username");

// redirect if no login
if (!username) {
  window.location.href = "index.html";
}

socket.emit("join", username);

let selectedUser = "";

const usersList = document.getElementById("users");
const messagesDiv = document.getElementById("messages");
const chatWith = document.getElementById("chatWith");

// USERS LIST
socket.on("onlineUsers", (users) => {
  usersList.innerHTML = "";

  users.forEach((user) => {
    if (user !== username) {
      const li = document.createElement("li");
      li.innerText = user;

      li.onclick = () => {
        selectedUser = user;
        chatWith.innerText = "Chat with " + user;
        messagesDiv.innerHTML = "";
      };

      usersList.appendChild(li);
    }
  });
});

// SEND
function sendMessage() {
  const input = document.getElementById("message");
  const msg = input.value;

  if (!selectedUser) {
    alert("Select user");
    return;
  }

  socket.emit("privateMessage", {
    to: selectedUser,
    message: msg,
    from: username
  });

  addMessage("You", msg);
  input.value = "";
}

// RECEIVE
socket.on("privateMessage", ({ message, from }) => {
  addMessage(from, message);
});

// ADD MESSAGE UI
function addMessage(sender, msg) {
  const div = document.createElement("div");

  div.className = sender === "You" ? "me" : "other";
  div.innerHTML = `<b>${sender}</b><br>${msg}`;

  messagesDiv.appendChild(div);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
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