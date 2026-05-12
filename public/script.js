const socket = io();

const name = localStorage.getItem("username");
const room = localStorage.getItem("room");
const pass = localStorage.getItem("password");
const dp = localStorage.getItem("dp");

socket.emit("joinRoom", { username: name, room, password: pass });

socket.on("wrongPassword", () => {
  alert("Wrong password");
  window.location = "index.html";
});

function send() {
  const msg = document.getElementById("msg").value;

  socket.emit("message", {
    name,
    msg,
    dp
  });

  document.getElementById("msg").value = "";
}

socket.on("message", (data) => {

  const isMe = data.name === name;

  const msgDiv = document.createElement("div");
  msgDiv.className = "msg " + (isMe ? "me" : "other");

  msgDiv.innerHTML = `
    ${!isMe ? `<img src="${data.dp}" class="dp">` : ""}

    <div class="bubble">
      <b>${data.name}</b><br>
      ${data.msg}
    </div>

    ${isMe ? `<img src="${data.dp}" class="dp">` : ""}
  `;

  const messages = document.getElementById("messages");

  messages.appendChild(msgDiv);

  // 🔥 AUTO SCROLL
  messages.scrollTop = messages.scrollHeight;

});

// IMAGE
function sendImage() {
  const file = document.getElementById("img").files[0];

  const reader = new FileReader();
  reader.onload = function() {
    socket.emit("message", {
      name,
      msg: `<img src="${reader.result}" width="120">`,
      dp
    });
  };

  reader.readAsDataURL(file);
}

// VOICE
function record() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = e => chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);

        socket.emit("message", {
          name,
          msg: `<audio controls src="${url}"></audio>`,
          dp
        });
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 3000);
    });
}

// typing
document.getElementById("msg").addEventListener("input", () => {
  socket.emit("typing", name);
});

socket.on("typing", (n) => {
  document.getElementById("typing").innerText = n + " typing...";

  setTimeout(() => {
    document.getElementById("typing").innerText = "";
  }, 1000);
});