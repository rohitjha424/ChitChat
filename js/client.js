const socket = io("https://ourchitchat.herokuapp.com/");

//Get DOM elements in respective Js variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

//Audio that will play when someone recieves the message
var audio = new Audio('ting.mp3');


//Function to scroll the message container to latest message
function scrollToLast(){
    var myDiv = document.getElementById("myDiv");
    myDiv.scrollTop = myDiv.scrollHeight; 
}

//Function which will append event info to the container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if(position=='left'){

      audio.play();
  }

  scrollToLast();
  
};





//Ask New user for his/her name by promt and let the server/all other people know
const name = prompt("Enter your name to join");

// checks if name is empty or null if it is then it again reloads the page and again asks!
if(name == ""){
    window.location.reload();
  }
if(name == null){
   window.location.reload();
  }
 
socket.emit("new-user-joined", name);

  //if a new user joins , Receive user's name from the server
socket.on('user-joined', (name) => {
  append(`${name} Joined the chat`, 'left');
});

//if server sends a message , receive it
socket.on('receive', data => {
    
  append(`${data.name}: ${data.message}`, 'left');
});

//idf a user leaves the chat , append the info to the container/ let all know!
socket.on('left', name => {
  append(`${name} left the chat`, 'left');
});


//if the form get submitted/someone sends a message, send it to server
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    //checks if message is not null
    if(message !==""){

        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
        scrollToLast();
    }
})


  


// socket.emit("new-user-joined", name);

// socket.on('user-joined', (name) => {
//   append(`${name} Joined the chat`, 'left');
// });


// socket.on('receive', data => {
//   append(`${data.name}: ${data.message}`, 'left');
// });

// socket.on('left', name => {
//   append(`${name} left the chat`, 'left');
// });
