var express = require('express');
var app = express();
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

let userList = [];

io.on("connection", (socket) => {
    socket.on('client-send-username', (data) => {
        if (userList.indexOf(data) >= 0) {
            socket.emit('server-response-register-fail');
        } else {
            userList.push(data);
            socket.username = data;
            socket.emit("server-response-register-success");
            io.sockets.emit('server-send-userlist', userList);
        }
    })

    socket.on('client-send-message', (data) => {
        io.sockets.emit('server-send-message', { username: socket.username, message: data });
    })

    socket.on('user-typing', function () {
        let notify = socket.username + " đang nhập văn bản";
        io.sockets.emit('anyone-typing', notify);
    })

    socket.on('user-stop-type', function () {
        io.sockets.emit('anyone-stop-type');
    })
})

app.get("/", (req, res) => {
    res.render("home");
})