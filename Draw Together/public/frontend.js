var socket = io();

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var mouse_down = false;
var current;
var past;

function draw(past, current, color, thickness){
  ctx.beginPath();
  ctx.moveTo(past[0], past[1]);
  ctx.strokeStyle = color;
  ctx.lineWidth= thickness;
  if(color === "white"){
    ctx.lineWidth= 20;
  };
  ctx.quadraticCurveTo(
    past[0], past[1],
    current[0], current[1]
  );
  ctx.stroke();
  ctx.closePath();
}


function clean (){
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 800, 600);
  ctx.closePath();
};

function clean_click () {
  socket.emit("clean");
  clean();
}

canvas.addEventListener("mousedown", function (event){
  mouse_down = true;
});
canvas.addEventListener("mouseup", function (event){
  mouse_down = false;
  past = null;
});
canvas.addEventListener("mousemove", function (event){
  if (mouse_down) {
    current = [event.offsetX, event.offsetY];
    color = $('input[name="color"]:checked').val();
    thickness = $('input[name="thickness"]:checked').val();
    if (past){
      draw(past, current, color, thickness);
    }
    socket.emit("draw", past, current, color, thickness);
    past = [event.offsetX, event.offsetY];
  }
});

$(function () {
  socket.on("draw", function(past, current, color, thickness){
    if (past) {
      draw(past, current, color, thickness);
    }
  });
});

$(function () {
  socket.on("clean", function(){
    clean();
  });
});

$(function () {
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
  });
});
