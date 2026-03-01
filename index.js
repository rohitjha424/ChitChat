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

  socket.on("new-user-joined", (userName) => {
    users[socket.id] = userName;
    socket.broadcast.emit("user-joined", userName);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message,
      name: users[socket.id]
    });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      socket.broadcast.emit("left", users[socket.id]);
      delete users[socket.id];
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});