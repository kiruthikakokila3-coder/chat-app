import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import PublicChat from "./pages/PublicChat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/public" element={<PublicChat />} />
      </Routes>
    </BrowserRouter>
  );
}