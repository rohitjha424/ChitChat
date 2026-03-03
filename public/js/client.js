const socket = io();
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

const audio = new Audio("ting.mp3");

function scrollToLast() {
  const myDiv = document.getElementById("myDiv");
  myDiv.scrollTop = myDiv.scrollHeight;
}

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message", position);
  messageContainer.append(messageElement);

  if (position === "left") {
    audio.play();
  }

  scrollToLast();
};

//Asking UserName
let userName = prompt("Enter your name to join");

if (!userName || userName.trim() === "") {
  window.location.reload();
}
//Asking chat RoomName
let roomName = prompt("Enter room name to join");

if (!roomName || roomName.trim() === "") {
  window.location.reload();
}

//Sending Both UserName and RoomName
socket.emit("join-room", {
  userName,
  roomName
});

socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "middleg");
  audio.play();
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

socket.on("left", (name) => {
  append(`${name} left the chat`, "middler");
  audio.play();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();

  if (message !== "") {
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  }
});