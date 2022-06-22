const express = require('express');
var app = express();
var server = require('http').createServer(app);
var io= require('socket.io').listen(server);

users=[];
connections=[];
//connect to port
server.listen(process.env.PORT || 3000);
console.log('Server listening to port 3000');
//write a route which sends the file index.html
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html')
});
//get a socket connected and push it to the array

io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('sockets connected : %s',connections.length);
    //disconnect
    socket.on('disconnect',function(data){
        
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
        console.log('disconnected: %s ',connections.length);
    })
    //send message
    socket.on('send message',function(data){
        io.sockets.emit('new message',{msg:data,user: socket.username});//goes to index.html function
    })
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username= data;
        users.push(socket.username);
        updateUsernames();
    })
    function updateUsernames(){
        io.sockets.emit('get users',users);//goes to index.html function

    }
})
