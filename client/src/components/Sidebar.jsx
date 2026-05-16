import {
  FaGlobe,
  FaLock,
  FaUserFriends,
  FaVideo,
  FaPhone,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({
  setRoomType,
  username,
}) {
  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#111",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        borderRight: "1px solid #222",
      }}
    >
      {/* Top */}
      <div>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#00b894",
          }}
        >
          CHAT-APP
        </h2>

        {/* User */}
        <div
          style={{
            background: "#1e1e1e",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#aaa",
            }}
          >
            Logged in as
          </p>

          <h3
            style={{
              marginTop: "5px",
            }}
          >
            {username || "Guest"}
          </h3>
        </div>

        {/* Menu */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <button
            onClick={() => setRoomType("public")}
            style={buttonStyle}
          >
            <FaGlobe />
            Public Chat
          </button>

          <button
            onClick={() => setRoomType("private")}
            style={buttonStyle}
          >
            <FaLock />
            Private Chat
          </button>

          <button style={buttonStyle}>
            <FaUserFriends />
            Friends
          </button>

          <button style={buttonStyle}>
            <FaVideo />
            Video Call
          </button>

          <button style={buttonStyle}>
            <FaPhone />
            Voice Call
          </button>

          <button style={buttonStyle}>
            <FaCog />
            Settings
          </button>
        </div>
      </div>

      {/* Bottom */}
      <button
        style={{
          ...buttonStyle,
          background: "#d63031",
        }}
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  background: "#1e1e1e",
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  fontSize: "15px",
};