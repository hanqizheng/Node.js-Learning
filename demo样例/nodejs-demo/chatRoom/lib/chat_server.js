const socketio =require('socket.io');

let io;
let guestNumber = 1;
let nickNames = {};
let nameUsed = [];
let currentRoom = {};

exports.listen = function(server){
    io = socketio.listen(server);
    io.set('log level',1);

    io.sockets.on('connection',(socket) => {
        guestNumber = assignGuestName(socket,guestNumber,nickNames,nameUsed);
        
        joinRoom(socket,'Lobby');

        handleMessageBroadcasting(socket,nickNames);

        handleNameChangeAttempts(socket,nickNames,nameUsed);

        handleRoomJioning(socket);

        socket.on('rooms',() => {
            socket.emit('rooms',io.socket.manager.rooms);
        });

        handleClientDisconnection(socket,nickNames,nameUsed);
    });

}

function assignGuestName(socket,guestNumber,nickNames,nameUsed){
    let name = 'Guest' + guestNumber;
    nickNames = [socket.id] = name;
    socket.emit('nameResult',{
        success:true,
        name:name
    });
    nameUsed.push(name);
    return guestNumber + 1;
}

function joinRoom(socket,room){
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult',{room:room});

    socket.broadcast.to(room).emit('message',{
        text:nickNames[socket.id] + 'has joined' + room + '.'
    });

    let usersInRoom = io.socket.clients(room);

    //如果不止一个用户在这个房间里，汇总一下都是谁
    if(usersInRoom.length > 1){
        let usersInRoomSummary = 'Users currently in' + room + ':';

        for(let index in usersInRoom){
            //记录id
            let userSocketId = usersInRoom[index].id;
            if(userSocketId != socket.id){
                if(index > 0){
                   usersInRoomSummary += ',  ';
                } 
            usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message',{text:usersInRoomSummary});

    }

}
//用户改名
function handleNameChangeAttempts(socket,nickNames,nameUsed){
    //设置改名事件
    socket.on('nameAttempt',(name) => {
        //限制昵称开头不能是Guest
        if(name.indexOf('Guest') == 0){
            socket.emit('nameResult', {
                success: false,
                message:'Name cannot begin with Guest'
            });
        }
        else{
            if(nameUsed.indexOf(name) == -1){
                //昵称没有被注册，现在将其注册
                let previousName = nickNames[socket.id];
                let previousNameIndex = nameUsed.indexOf(previousName);
                nameUsed.push(name);
                nickNames[socket.id] = name;
                delete nameUsed[previousNameIndex];
                
                socket.emit('nameResult',{
                    success:true,
                    name:name
                });

                socket.broadcast.to(currentRoom[socket.id]).emit('message',{
                    text:previousName + 'is now konw as ' + name + '.'
                });
            }
            else{
                //用户名已经使用了
                socket,emit('nameResult',{
                    success:false,
                    message:'that name is already in use .'
                });
            }
        }
    });
}

//将聊天记录广播出去
function handleMessageBroadcasting(socket,nickNames){
    socket.on('message',(message) => {
        socket.broadcast.to(message.room).emit('message',{
            text:nickNames[socket.id] + ': ' + message.text
        });
    });
}

//可以创建多个房间
function handleRoomJoining(socket){
    socket.on('join',(room) => {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket,room.newRoom);
    });
}

function handleClientDisconnection(socket,nickNames,nameUsed){
    socket.on('disconnect',() => {
        let nameIndex = nameUsed.indexOf(nickNames[socket.id]);
        delete nameUsed[nameIndex];
        delete nickNames[socket.id];
    });
}