import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Listen for task events
  onTaskCreated(callback) {
    if (this.socket) {
      this.socket.on('taskCreated', callback);
    }
  }

  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on('taskUpdated', callback);
    }
  }

  onTaskDeleted(callback) {
    if (this.socket) {
      this.socket.on('taskDeleted', callback);
    }
  }

  // Group management methods
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Listen for activity log updates
  onActivityLogUpdated(callback) {
    if (this.socket) {
      this.socket.on('activity_log_updated', callback);
    }
  }

  // Remove event listeners
  offTaskCreated() {
    if (this.socket) {
      this.socket.off('taskCreated');
    }
  }

  offTaskUpdated() {
    if (this.socket) {
      this.socket.off('taskUpdated');
    }
  }

  offTaskDeleted() {
    if (this.socket) {
      this.socket.off('taskDeleted');
    }
  }

  offActivityLogUpdated() {
    if (this.socket) {
      this.socket.off('activity_log_updated');
    }
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService; 