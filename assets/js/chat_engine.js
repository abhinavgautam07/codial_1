// chat_sockets.js will work as the observer and the chat_engine is going to be subscriber
class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        //io is the global variable and it is avialable as soon as we have included the cdnjs script
        //here we are sending the request to establish a connection
        this.socket = io.connect("http://localhost:5000");

        if (this.userEmail) {
            this.connectionHandler();
        }
    }
    connectionHandler() {
        let self = this; //this refers to the object of class
        //one thing clearly that emit is for sending an event and on is for receiving that event;
        // it will have a to and fro interaction between the subscriber and observer

        //when the connection is established the server acknowleges the front end and the front end fires the on connect function

        this.socket.on("connect", function() {
            //here on is receving the event emitted by the backend
            console.log("connections established using sockets...");
            //now once connection to the socket is established
            //here we are emitting the event to the backend
            self.socket.emit("join_room", {
                user_email: self.userEmail,
                chatroom: "codial"
            });
            //here we are receiving the event emmited by the backend
            self.socket.on("user_joined", function(data) {
                console.log("a user joined", data);
            });
            $("#send-button").click(function() {
                let msg = $("#message-content").val();
                if (msg != "") {
                    self.socket.emit("send_message", {
                        message: msg,
                        user_email: self.userEmail,
                        chatroom: "codial"
                    });
                }
            });
            self.socket.on("receive_message", function(data) {
                console.log("message received", data.message);
                let newMessage = $("<li>");
                let messageType = "other-message";
                //check is made as the user sending the message also receives it when it is emiited back by the server
                if (data.user_email == self.userEmail) {
                    messageType = "self-message";
                }
                newMessage.addClass(messageType);
                newMessage.append(`<span>${data.message}</span>`);

                newMessage.append(`<sub>${data.user_email}</sub>`);
                $('#chat-list').append(newMessage);
            });
        });

    }
}