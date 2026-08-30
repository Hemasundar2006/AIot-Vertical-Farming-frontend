import axios from 'axios';

// Automatically uses your environment backend URL or relative /api proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat with backend database chatbot
export async function sendChatMessage(message, conversationHistory = []) {
  try {
    const response = await apiClient.post('/chatbot/chat', {
      message,
      conversationHistory: conversationHistory.slice(-5),
    });
    if (response.data && response.data.response) {
      return response.data.response;
    } else if (response.data && response.data.message) {
      return response.data.message;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Chat API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to get response from farm database.');
  }
}

// Start chat session
export async function createChatSession(userDetails) {
  const response = await apiClient.post('/chatbot/session', userDetails);
  return response.data;
}

// Save message to session
export async function saveSessionMessage(sessionId, role, content) {
  const response = await apiClient.post(`/chatbot/session/${sessionId}/message`, {
    role,
    content,
    isAudio: false
  });
  return response.data;
}

// Health check endpoint
export async function checkChatbotHealth() {
  try {
    const response = await apiClient.get('/chatbot/health');
    return {
      healthy: response.data?.healthy || false,
      configured: response.data?.configured || false,
      message: response.data?.message || 'Unknown status',
    };
  } catch (error) {
    console.error('Health check error:', error);
    return {
      healthy: false,
      configured: false,
      message: error.message || 'Health check failed',
    };
  }
}

// Check if backend API is available
export async function isBackendApiAvailable() {
  try {
    const health = await checkChatbotHealth();
    return health.healthy && health.configured;
  } catch (error) {
    return false;
  }
}

export default {
  sendChatMessage,
  createChatSession,
  saveSessionMessage,
  checkChatbotHealth,
  isBackendApiAvailable,
};
