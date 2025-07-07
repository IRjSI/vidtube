import { MessageModel } from "../models/message.model.js";

export default function socketHandler(io) {
  io.on('connection', (socket) => {

    socket.on("joinRoom", ({ room }) => {
      socket.join(room);
    });

    socket.on("message", async ({ room, message, userId, friendId }) => {
      try {
        // 1️⃣ Save the message to MongoDB
        const newMessage = await MessageModel.create({
          content: message,
          friend: friendId,
          user: userId,
          room: room
        });

        // 2️⃣ Broadcast the new message to others in the room
        io.to(room).emit("newMessage", {
          message: newMessage.content, // or send whole object if needed
          user: newMessage.user,       // optional: sender info
          createdAt: newMessage.createdAt // optional: timestamp
        });

      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on('disconnect', () => {
    });
  });
}
