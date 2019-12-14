// chat_sockets.js will work as the observer and the chat_engine is going to be subscriber
// it is going to receive connections from all the subscriber.
// user that is the subscriber initiates the connection, the observer detects the 
// connection and then acknowledges it
//here it receives thr request from frontend 
module.exports.chatSockets = function(socketServer) {
    let io = require('socket.io')(socketServer);
    //the connection is established the socket is sent back

    io.sockets.on('connection', function(socket) {
        console.log("new connection established", socket.id);

        socket.on('disconnect', function() {
            console.log("sockets disconnected");
        });
        socket.on('join_room', function(data) {
            console.log('joining request rec.', data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });
        socket.on('send_message', function(data) {

            io.in(data.chatroom).emit('receive_message', data);
        });
    });

}