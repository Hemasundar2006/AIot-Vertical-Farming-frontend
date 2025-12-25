import axios from 'axios';

// Backend API base URL - will use Vercel proxy in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat with the backend chatbot API
export async function sendChatMessage(message, conversationHistory = []) {
  try {
    const response = await apiClient.post('/chatbot/chat', {
      message: message,
      conversationHistory: conversationHistory.slice(-5), // Last 5 messages for context
    });

    if (response.data && response.data.response) {
      return response.data.response;
    } else if (response.data && response.data.message) {
      return response.data.message;
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Error in request setup
      throw new Error(error.message || 'Failed to send chat message');
    }
  }
}

// Alternative endpoint (for compatibility)
export async function sendChatMessageAlt(message, conversationHistory = []) {
  try {
    const response = await apiClient.post('/chatbot', {
      message: message,
      conversationHistory: conversationHistory.slice(-5),
    });

    if (response.data && response.data.response) {
      return response.data.response;
    } else if (response.data && response.data.message) {
      return response.data.message;
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Chat API error (alt):', error);
    throw error;
  }
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
  sendChatMessageAlt,
  checkChatbotHealth,
  isBackendApiAvailable,
};

