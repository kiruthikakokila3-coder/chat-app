const socket = io("https://chat-app-6ih8.onrender.com");

let username = "";
let currentChat = "";

function join() {
  username = document.getElementById("username").value;
  socket.emit("join", username);
}

// 👥 USERS LIST
socket.on("users_list", (users) => {
  const list = document.getElementById("users");
  list.innerHTML = "";

  users.forEach(user => {
    if (user !== username) {
      list.innerHTML += `
        <div class="user online" onclick="openChat('${user}')">
          🟢 ${user}
        </div>
      `;
    }
  });
});

// 💬 OPEN PRIVATE CHAT
function openChat(user) {
  currentChat = user;
  document.getElementById("chatTitle").innerText = user;
}

// SEND MESSAGE
function sendMsg() {
  const msg = document.getElementById("msg").value;

  socket.emit("private_message", {
    to: currentChat,
    message: msg,
    from: username
  });
}

// RECEIVE
socket.on("private_message", (data) => {
  document.getElementById("messages").innerHTML += `
    <p><b>${data.from}:</b> ${data.message}</p>
  `;
});

// USER LEFT
socket.on("user_left", (user) => {
  alert(user + " left");
});