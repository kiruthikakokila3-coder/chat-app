import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* =========================
   AUTH APIs
========================= */

// Register
export const registerUser = async (userData) => {
  const res = await API.post(
    "/auth/register",
    userData
  );

  return res.data;
};

// Login
export const loginUser = async (userData) => {
  const res = await API.post(
    "/auth/login",
    userData
  );

  return res.data;
};

/* =========================
   ROOM APIs
========================= */

// Create Room
export const createRoom = async (
  roomData,
  token
) => {
  const res = await API.post(
    "/rooms/create",
    roomData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Join Room
export const joinRoom = async (
  roomId,
  username,
  token
) => {
  const res = await API.post(
    `/rooms/join/${roomId}`,
    { username },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =========================
   MESSAGE APIs
========================= */

// Get Messages
export const getMessages = async (
  roomId,
  token
) => {
  const res = await API.get(
    `/messages/${roomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Send Message
export const sendMessageAPI = async (
  messageData,
  token
) => {
  const res = await API.post(
    "/messages/send",
    messageData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =========================
   STORY APIs
========================= */

// Upload Story
export const uploadStory = async (
  formData,
  token
) => {
  const res = await API.post(
    "/stories/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

// Get Stories
export const getStories = async () => {
  const res = await API.get("/stories");

  return res.data;
};

export default API;