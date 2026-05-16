import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function PublicChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join_room", "public");

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", {
      room: "public",
      text: message,
    });
  };

  return (
    <div>
      <h1>Public Chat</h1>

      {messages.map((msg, i) => (
        <p key={i}>{msg.text}</p>
      ))}

      <input
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}