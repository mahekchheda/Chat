var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var client = redis.createClient(); //creates a new client

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  client.lrange('chats', 0, -1, function(err, reply) {
      io.emit('history',reply)
  });
  socket.on('chat message', function(msg){
    client.rpush(['chats',msg], function(err, reply) {
        console.log(reply); //prints 2
    });
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
