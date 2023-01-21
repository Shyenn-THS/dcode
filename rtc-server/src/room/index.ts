import { Socket } from 'socket.io';
import { IMessage, IRoomParams } from '../../types/room';

const rooms: Record<string, string[]> = {};
const chats: Record<string, IMessage[]> = {};

export const roomHandler = (socket: Socket) => {
  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      const existingUser = rooms[roomId].filter((id) => id === peerId);
      if (existingUser.length !== 0) return;

      console.log(`User ${peerId} joined a room ${roomId}`);
      rooms[roomId].push(peerId);
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { peerId });

      socket.emit('get-users', {
        roomId,
        participants: rooms[roomId],
      });
    } else {
      rooms[roomId] = [];
      console.log(`User ${peerId} created a room ${roomId}`);
      rooms[roomId].push(peerId);
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { peerId });
    }

    const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
      rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
      socket.to(roomId).emit('user-disconnected', peerId);
    };

    socket.on('disconnect', () => {
      console.log(`User ${peerId} left the room`);
      leaveRoom({ roomId, peerId });
    });
  };

  const addMessage = (roomId: string, message: IMessage) => {
    if (chats[roomId]) {
      chats[roomId].push(message);
    } else {
      chats[roomId] = [message];
    }
    socket.to(roomId).emit('add-message', message);
  };

  socket.on('send-message', addMessage);
  socket.on('join-room', joinRoom);
};
