const socket = io();

const username = localStorage.getItem("username");
const img = localStorage.getItem("img");
const room = "public";

socket.emit("join", { username, room });

// old msgs
socket.on("oldMessages", (msgs) => {
  msgs.forEach(addMsg);
});

// typing
msg.oninput = () => {
  socket.emit("typing", room);
};

socket.on("typing", (user) => {
  typing.innerText = user + " typing...";
  setTimeout(()=>typing.innerText="", 2000);
});

function send(){
  socket.emit("sendMessage", {
    message: msg.value,
    room
  });

  socket.emit("seen", room);

  msg.value = "";
}

// seen
socket.on("seen", (user)=>{
  console.log(user + " seen");
});

// new msg
socket.on("message", (data) => {
  addMsg(data);
});

function addMsg(data){
  const div = document.createElement("div");
  div.className = "msg";

  div.innerHTML = `
    <b>${data.user}</b><br>
    ${data.text}
    <div class="time">${data.time}</div>
  `;

  messages.appendChild(div);
}