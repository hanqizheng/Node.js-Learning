function divEscapedContentElement(message){
    return $('<div></div>').text(message);
}

function divSystemContentElement(message){
    return $('<div></div>').html('<i>' + message + '</i>');
}

//处理用户输入
function processUserInput(chatApp,socket){
    let message = $('#send-message').val();
    let systemMessage;

    //如果是以'/'开头
    if(message.charAt(0) == '/'){
        systemMessage = chatApp.processCommand(message);
        if(systemMessage){
            $('#message').append(divSystemContentElement(systemMessage));
        }    
    }
    else{
        chatApp.sendMessage($('#room').text(),message);
        $('#messages').append(divEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }

    $('#send-message').val(' ');
}

let socket = io.connect();

$(document).ready(function() {
    let chatApp = new Chat(socket);

    socket.on('nameResualt',(result) => {
        let message;
        if(result.success){
            message = 'You are now konw as ' + result.name + '.'; 
        }
        else{
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    });

    socket.on('joinResult',(result) => {
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room Changed.'));
    });

    socket.on('message',(rooms) => {
        $('#room-list').empty();

        for(let room in rooms){
            room = room.substring(1,room.length);
            if(room != ''){
                $('#room-list').append(divEscapedContentElement(room));
            }
        }

        $('#room-list div').click(() => {
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        });
    });

    setInterval(() => {
        socket.emit('rooms');
    },1000);

    $('#send-message').focus();

    $('#send-form').submit(() => {
        processUserInput(chatApp,socket);
        return false;
    });
});