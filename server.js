const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

server.listen(3000);
//carrega arquivo html
app.use(express.static(path.join(__dirname, 'public')));

//
let connetedUsers = [];

//escutador de conexão
io.on('connection', (socket) => {
    console.log("conexão detectada...");
    //     
    socket.on('join-request', (username) => {
        socket.username = username;
        connetedUsers.push(username);
        console.log(connetedUsers);

        socket.emit('user-ok', connetedUsers);
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connetedUsers
        });
    });
    socket.on('disconnect', () => {
        connetedUsers = connetedUsers.filter(u => u != socket.username);
        console.log(connetedUsers);

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connetedUsers
        });

    });
    socket.on('send-msg',(txt) => {
        let obj = {
            username: socket.username,
            message: txt

        };
        //socket.emit('show-msg',obj);
        socket.broadcast.emit('show-msg',obj);
    })

});

