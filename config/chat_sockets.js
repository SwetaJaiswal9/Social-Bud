const socketIO = require('socket.io');

module.exports.chatSockets = function (socketServer) {
  // let io = require("socket.io")(socketServer);
  const io = socketIO(socketServer, {
    cors: {
      origin: 'http://localhost:8000',  
      methods: ['GET', 'POST'],
      credentials: true 
    }
  });

  io.sockets.on("connection", function (socket) {
    console.log("New connection received", socket.id);

    socket.on("disconnect", function () {
      console.log("Socket disconnected!");
    });

    socket.on("join_room", function (data) {
      console.log("Joining request received", data);

      socket.join(data.chatroom);

      io.in(data.chatroom).emit("user_joined", data);
    });

    socket.on("send_message", function (data) {
      io.in(data.chatroom).emit("receive_message", data);
    });
  });
};
