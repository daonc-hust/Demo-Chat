var socket = io();

socket.on("server-response-register-success", function () {
    $('#login-form').hide(2000);
    $('#chat-form').show(1000);
})

socket.on('server-response-register-fail', function () {
    alert("Tài khoản này đã tồn tại!")
})

socket.on('server-send-userlist', (data) => {
    $('#box-user-list').html("");
    data.forEach((user) => {
        $('#box-user-list').append("<div class='user'>" + user + "</div>");
    })
})

socket.on('server-send-message', (data) => {
    $('#box-message').append("<div id='message'>" + data.username + " : " + data.message + "</div>");
    $('#user-message').val("");
})

socket.on('anyone-typing', (data) => {
    $('#notify').html(data);
})

socket.on('anyone-stop-type', () => {
    $('#notify').html("");
})

$(document).ready(() => {
    $('#login-form').show();
    $('#chat-form').hide();

    $('#btn-register').click(function () {
        socket.emit('client-send-username', $('[name="user-name"]').val());
        $('[name="user-name"]').val("");
    })

    $('#btn-send-message').click(function () {
        let message = $('[name="user-message"]').val();
        socket.emit('client-send-message', message);
        $('[name="user-message"]').val("");
    })

    $('[name="user-name"]').keydown(event => {
        if (event.which === 13) {
            username = $('[name="user-name"]').val();
            socket.emit('client-send-username', username);
            $('[name="user-name"]').val("");
        }
    });

    $('[name="user-message"]').keydown(event => {
        if (event.which === 13) {
            let message = $('[name="user-message"]').val();
            socket.emit('client-send-message', message);
            $('[name="user-message"]').val("");
        }
    });

    $('[name="user-message"]').focusin(function () {
        socket.emit("user-typing");
    })

    $('[name="user-message"]').focusout(function () {
        socket.emit("user-stop-type");
    })
})