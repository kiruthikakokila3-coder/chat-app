const socket = io();

let user = localStorage.getItem("user");
let room = localStorage.getItem("room");

socket.emit("login", user);
socket.emit("join", room);

const chat = document.getElementById("chat");
const msg = document.getElementById("msg");
const typing = document.getElementById("typing");
const online = document.getElementById("online");

function send(){

  if(msg.value){
    socket.emit("msg", {
      user,
      text: msg.value,
      room
    });
  }

  const file = document.getElementById("file").files[0];

  if(file){
    let form = new FormData();
    form.append("file", file);

    fetch("/upload", { method:"POST", body:form })
    .then(r=>r.json())
    .then(data=>{
      socket.emit("msg", {
        user,
        image:data.url,
        room
      });
    });
  }

  msg.value="";
}

socket.on("msg", (data)=>{
  let div = document.createElement("div");

  div.className = "msg " + (data.user===user ? "me":"other");

  div.innerHTML = `
    <b>${data.user}</b><br>
    ${data.text || ""}
    ${data.image ? `<img src="${data.image}" width="100">` : ""}
  `;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

msg.addEventListener("input", ()=>{
  socket.emit("typing", user);
});

socket.on("typing", (u)=>{
  typing.innerText = u + " typing...";
  setTimeout(()=>typing.innerText="",2000);
});

socket.on("online", (list)=>{
  online.innerText = "Online: " + list.join(",");
});