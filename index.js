//node Server which will handle socket io connections
// const io = require("socket.io")(8000);
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const cors = require('cors');
app.use(cors({

  origin: "*",
  

}))


 var port = process.env.PORT || 8000


const users = {};

io.on("connection", (socket) => {
    //If a new user joins the chat then others would get to know!
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });


  //if someone sends a message, broadcast it to all people!
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {message: message, name: users[socket.id]});
  });

  //if someone leaves the chat, all others would get to know!
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];

  });


});

http.listen(port, function(){
console.log('listening on *:8000');
});


