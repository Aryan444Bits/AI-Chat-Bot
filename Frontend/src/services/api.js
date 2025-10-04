import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://ai-chat-bot-9c7l.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', {
      email: userData.email,
      fullName: {
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      password: userData.password,
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  logout: async () => {
    // Clear the cookie by making a request without token
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      // Even if the logout request fails, we'll clear the local state
      console.warn('Logout request failed, but continuing with local cleanup');
    }
    // Clear any local storage if needed
    // localStorage.removeItem('token'); // if you store token in localStorage
  },
};

// Chat API calls
export const chatAPI = {
  createChat: async (title) => {
    const response = await api.post('/api/chat', { title });
    return response.data;
  },

  getChats: async () => {
    const response = await api.get('/api/chat');
    return response.data;
  },

  getMessages: async (chatId) => {
    const response = await api.get(`/api/chat/messages/${chatId}`);
    return response.data;
  },
};

// Socket connection for real-time messaging
class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.socket || !this.isConnected) {
      this.socket = io(API_BASE_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  sendMessage(chatId, content) {
    if (this.socket && this.isConnected) {
      this.socket.emit('ai-message', {
        chat: chatId,
        content: content,
      });
    } else {
      console.error('Socket not connected');
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('ai-response', callback);
    }
  }

  offMessage(callback) {
    if (this.socket) {
      this.socket.off('ai-response', callback);
    }
  }
}

export const socketService = new SocketService();

export default api;