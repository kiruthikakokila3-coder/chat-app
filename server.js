// server.js

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname))

// ROOMS
let rooms = {}

io.on("connection", (socket)=>{

console.log("User Connected")

// CREATE ROOM
socket.on("create room", (data)=>{

const {
roomName,
password,
type,
userName
} = data

// CREATE ROOM
rooms[roomName] = {
password,
type,
users:[userName]
}

socket.join(roomName)

socket.room = roomName
socket.userName = userName

socket.emit("room joined", roomName)

io.to(roomName).emit(
"room users",
rooms[roomName].users
)

})

// JOIN ROOM
socket.on("join room", (data)=>{

const {
roomName,
password,
userName
} = data

const room = rooms[roomName]

if(!room){
socket.emit("error message","Room Not Found")
return
}

// PASSWORD CHECK
if(room.password !== password){
socket.emit("error message","Wrong Password")
return
}

// PRIVATE ROOM ONLY 2 USERS
if(
room.type === "private" &&
room.users.length >= 2
){
socket.emit("error message",
"Private Room Full"
)
return
}

// JOIN
room.users.push(userName)

socket.join(roomName)

socket.room = roomName
socket.userName = userName

socket.emit("room joined", roomName)

io.to(roomName).emit(
"room users",
room.users
)

})

// CHAT MESSAGE
socket.on("chat message",(msg)=>{

if(socket.room){

socket.to(socket.room).emit(
"chat message",
{
name:socket.userName,
message:msg
}
)

}

})

// TYPING
socket.on("typing", ()=>{

socket.to(socket.room).emit(
"typing",
socket.userName
)

})

// STOP TYPING
socket.on("stop typing", ()=>{

socket.to(socket.room).emit(
"stop typing"
)

})

// DISCONNECT
socket.on("disconnect", ()=>{

const roomName = socket.room

if(roomName && rooms[roomName]){

rooms[roomName].users =
rooms[roomName].users.filter(
u => u !== socket.userName
)

io.to(roomName).emit(
"room users",
rooms[roomName].users
)

// DELETE EMPTY ROOM
if(rooms[roomName].users.length === 0){
delete rooms[roomName]
}

}

})

})

server.listen(3000, ()=>{
console.log("Running on 3000")
})