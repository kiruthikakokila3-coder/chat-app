const socket = io();
const user = localStorage.getItem("user");

socket.emit("join", user);

const params = new URLSearchParams(location.search);
const type = params.get("type");
const friend = params.get("friend");

if(type === "public"){
  socket.emit("joinPublic", user);
}else{
  socket.emit("joinPrivate", {user, friend});
}

function send(){
  const msg = document.getElementById("msg").value;

  if(type === "public"){
    socket.emit("publicMessage", {user, msg});
  }else{
    socket.emit("privateMessage", {user, friend, msg});
  }
}

socket.on("message", (data)=>{
  document.getElementById("messages").innerHTML +=
    `<p><b>${data.user}</b>: ${data.msg} <small>${data.time}</small></p>`;
});

document.getElementById("msg").addEventListener("input", ()=>{
  socket.emit("typing", user);
});

socket.on("typing", (msg)=>{
  document.getElementById("typing").innerText = msg;
  setTimeout(()=> typing.innerText="", 2000);
});