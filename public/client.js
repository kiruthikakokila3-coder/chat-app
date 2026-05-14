const socket = io();

const user = localStorage.getItem("username");

socket.emit("join", user);

// send msg
function send(){
  const msg = document.getElementById("msg").value;

  socket.emit("msg", {
    user,
    text: msg
  });
}

// receive msg
socket.on("msg", (data)=>{
  const box = document.getElementById("chat-box");

  const div = document.createElement("div");
  div.innerHTML = `<b>${data.user}</b>: ${data.text} ✔✔`;

  box.appendChild(div);
});

// typing
function typing(){
  socket.emit("typing", user);
}

socket.on("typing", (data)=>{
  document.getElementById("status").innerText = data;
});

// online
socket.on("online", (count)=>{
  document.getElementById("online").innerText =
  "🟢 "+count+" online";
});