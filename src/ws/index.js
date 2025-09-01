import { MessageModel } from "../models/message.model.js";

export default function socketHandler(io) {
  // Whenever a new client connects (e.g., a user opens the chat app), this event triggers.
  // A unique socket object is created for each connected user.
  io.on('connection', (socket) => {

    // Listens for an event called "joinRoom" from the client.
    socket.on("joinRoom", ({ room }) => {
      socket.join(room); // socket.join(room) makes the user enter that chat room (so only users in that room will receive messages for it).
    });

    socket.on("message", async ({ room, message, userId, friendId }) => {
      try {
        const newMessage = await MessageModel.create({
          content: message,
          friend: friendId,
          user: userId,
          room: room
        });

        // Once the message is stored, it broadcasts to everyone in the room. 
        // The event sent to clients is "newMessage".
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
