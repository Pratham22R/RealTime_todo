let ioInstance;

export default function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    socket.on('join_group', (groupId) => {
      socket.join(groupId);
      console.log(`🔌 User ${socket.id} joined group ${groupId}`);
    });

    socket.on('leave_group', (groupId) => {
      socket.leave(groupId);
      console.log(`🔌 User ${socket.id} left group ${groupId}`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.id);
    });
  });
  
  ioInstance = io;
  return io;
}

export const getIO = () => {
  if (!ioInstance) throw new Error('Socket.io not initialized!');
  return ioInstance;
};
