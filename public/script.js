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

socket.on("roomUsers", (users) => {
  document.getElementById("users").innerText = "Users: " + users.join(", ");
});

function send() {
  const msg = document.getElementById("msg").value;

  socket.emit("message", {
    name,
    msg,
    dp
  });
}

socket.on("message", (data) => {
  const div = document.createElement("div");

  div.innerHTML = `
    <img src="${data.dp}" width="30">
    <b>${data.name}</b>: ${data.msg}
  `;

  document.getElementById("messages").appendChild(div);
});

// IMAGE
function sendImage() {
  const file = document.getElementById("img").files[0];

  const reader = new FileReader();
  reader.onload = function() {
    socket.emit("message", {
      name,
      msg: `<img src="${reader.result}" width="100">`,
      dp
    });
  };

  reader.readAsDataURL(file);
}

// VOICE
function record() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.ondataavailable = e => chunks.push(e.data);

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);

        socket.emit("message", {
          name,
          msg: `<audio controls src="${url}"></audio>`,
          dp
        });
      };

      mediaRecorder.start();

      setTimeout(() => mediaRecorder.stop(), 3000);
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