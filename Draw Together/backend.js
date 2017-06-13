var express = require("express");
var app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http);

var history = [];

app.use('/socket-io',
  express.static('node_modules/socket.io-client/dist'));

app.set("view engine", "hbs");

app.use("/static", express.static("public"));

app.get('/', function (request, response){
  response.render('index.hbs');
});

io.on("connection", function(socket){
  console.log("Connected");
  if (history){
    console.log(history);
    for(var i=0; i<history.length; i++){
      socket.emit("draw", history[i][0], history[i][1], history[i][2], history[i][3]);
    }
  }

  socket.on("disconnect", function(){
    console.log("EXITED");
  });

  socket.on("draw", function(past, current, color, thickness){
    history.push([past, current, color, thickness]);
    socket.broadcast.emit("draw", past, current, color, thickness);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on("clean", function(){
    history = [];
    socket.broadcast.emit("clean");
  })
});

http.listen(8000, function(){
  console.log("Listening on port 8000");
});
