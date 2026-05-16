import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function PublicChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const username =
    localStorage.getItem("username") || "Guest";

  useEffect(() => {
    socket.emit("join_room", "public");

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      room: "public",
      username,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);

    setMessages((prev) => [...prev, messageData]);

    setMessage("");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "20px auto",
        background: "#111",
        borderRadius: "15px",
        padding: "20px",
        color: "white",
        height: "85vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "15px",
          borderBottom: "1px solid #222",
          paddingBottom: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#00b894",
          }}
        >
          🌍 Public Chat Room
        </h2>

        <p
          style={{
            color: "#aaa",
            marginTop: "5px",
            fontSize: "14px",
          }}
        >
          Unlimited users can join
        </p>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#1e1e1e",
          borderRadius: "10px",
          padding: "15px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                msg.username === username
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "12px",
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
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            background: "#2d3436",
            color: "white",
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