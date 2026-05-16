import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

export default function Home() {
  const [roomType, setRoomType] = useState("public");

  // Temporary username
  const username =
    localStorage.getItem("username") || "Guest";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0f0f0f",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        setRoomType={setRoomType}
        username={username}
      />

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navbar */}
        <Navbar username={username} />

        {/* Chat Section */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflow: "hidden",
          }}
        >
          <ChatBox
            room={roomType}
            username={username}
          />
        </div>
      </div>
    </div>
  );
}