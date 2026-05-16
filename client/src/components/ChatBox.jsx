import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatBox({ room, username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", () => {
      setTyping(true);

      setTimeout(() => {
        setTyping(false);
      }, 2000);
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      room,
      username,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);

    setMessages((prev) => [...prev, messageData]);

    setMessage("");
  };

  const handleTyping = () => {
    socket.emit("typing", room);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "20px auto",
        background: "#111",
        borderRadius: "15px",
        padding: "20px",
        color: "white",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "15px",
        }}
      >
        CHAT-APP
      </h2>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          background: "#1e1e1e",
          borderRadius: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems:
                msg.username === username
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <div
              style={{
                background:
                  msg.username === username
                    ? "#00b894"
                    : "#2d3436",
                padding: "10px 15px",
                borderRadius: "15px",
                maxWidth: "70%",
              }}
            >
              <strong>{msg.username}</strong>

              <p
                style={{
                  margin: "5px 0",
                }}
              >
                {msg.text}
              </p>

              <small>{msg.time}</small>
            </div>
          </div>
        ))}

        {typing && (
          <p
            style={{
              color: "#aaa",
              fontSize: "14px",
            }}
          >
            Someone typing...
          </p>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "15px",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#00b894",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}