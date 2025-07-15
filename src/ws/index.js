import { MessageModel } from "../models/message.model.js";

export default function socketHandler(io) {
  io.on('connection', (socket) => {

    socket.on("joinRoom", ({ room }) => {
      socket.join(room);
    });

    socket.on("message", async ({ room, message, userId, friendId }) => {
      try {
        const newMessage = await MessageModel.create({
          content: message,
          friend: friendId,
          user: userId,
          room: room
        });

        io.to(room).emit("newMessage", {
          message: newMessage.content,
          user: newMessage.user,
          createdAt: newMessage.createdAt
        });

      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on('disconnect', () => {
    });
  });
}
