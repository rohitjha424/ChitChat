const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8000;

const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ userName, roomName }) => {
  users[socket.id] = { userName, roomName };

  socket.join(roomName);

  socket.to(roomName).emit("user-joined", userName);

  console.log(`${userName} joined ${roomName}`);
});

  socket.on("send", (message) => {
  const user = users[socket.id];

  if (user) {
    io.to(user.roomName).emit("receive", {
      message,
      name: user.userName
    });
  }
});

  socket.on("disconnect", () => {
  const user = users[socket.id];

  if (user) {
    socket.to(user.roomName).emit("left", user.userName);
    delete users[socket.id];
  }
});
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});