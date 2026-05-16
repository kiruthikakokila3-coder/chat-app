import { FaComments, FaUserCircle } from "react-icons/fa";

export default function Navbar({ username }) {
  return (
    <nav
      style={{
        width: "100%",
        background: "#111",
        color: "white",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        borderBottom: "1px solid #222",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaComments size={28} color="#00b894" />

        <h2
          style={{
            margin: 0,
            fontSize: "24px",
          }}
        >
          CHAT-APP
        </h2>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaUserCircle size={28} color="#00b894" />

        <span
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {username || "Guest"}
        </span>
      </div>
    </nav>
  );
}