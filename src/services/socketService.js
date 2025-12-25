import io from 'socket.io-client';

const SOCKET_URL = 'https://aiot-vertical-farming-backend.onrender.com';

let socket = null;
let isConnected = false;

// Initialize Socket.IO connection
export const initializeSocket = () => {
  if (socket && isConnected) {
    return socket;
  }

  // Check if we should prefer polling (if WebSocket consistently fails)
  const preferPolling = localStorage.getItem('socket_prefer_polling') === 'true';
  
  socket = io(SOCKET_URL, {
    transports: preferPolling ? ['polling', 'websocket'] : ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 20000,
    forceNew: false,
    autoConnect: true,
  });

  let websocketFailed = false;

  socket.on('connect', () => {
    console.log('✅ Socket.IO connected to backend');
    isConnected = true;
    websocketFailed = false;
  });

  socket.on('connect_error', (error) => {
    // Only log if it's not a WebSocket fallback (which is expected)
    const isWebSocketError = error.message && (
      error.message.includes('websocket') || 
      error.message.includes('WebSocket') ||
      error.type === 'TransportError'
    );
    
    if (isWebSocketError && !websocketFailed) {
      // First WebSocket failure - will fallback to polling, this is expected
      websocketFailed = true;
      console.log('⚠️ WebSocket unavailable, falling back to polling...');
      // Remember to prefer polling next time
      localStorage.setItem('socket_prefer_polling', 'true');
    } else if (!isWebSocketError) {
      // Actual connection error, not just WebSocket fallback
      console.error('❌ Socket connection error:', error.message);
    }
    
    // Don't set isConnected to false on connect_error - let it try polling
    // Only set to false if all transports fail
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
    isConnected = false;
    
    // If disconnected due to transport error, prefer polling next time
    if (reason === 'transport close' || reason === 'transport error') {
      localStorage.setItem('socket_prefer_polling', 'true');
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    isConnected = true;
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
  });

  socket.on('reconnect_failed', () => {
    console.error('❌ Socket reconnection failed after all attempts');
    isConnected = false;
  });

  return socket;
};

// Get current socket instance
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

// Check if socket is connected
export const isSocketConnected = () => {
  return socket && isConnected;
};

// Send message to backend via Socket.IO
export const sendMessageViaSocket = (message, callback) => {
  const currentSocket = getSocket();
  
  if (!isSocketConnected()) {
    console.warn('Socket not connected, attempting to reconnect...');
    currentSocket.connect();
  }

  // Emit message to backend
  currentSocket.emit('chat_message', {
    message: message,
    timestamp: new Date().toISOString(),
    type: 'vertical_farming_query'
  });

  // Handle timeout
  const timeout = setTimeout(() => {
    if (callback) {
      callback(new Error('Response timeout'), null);
    }
  }, 30000); // 30 second timeout

  // Listen for response (single listener that handles both response and timeout clearing)
  currentSocket.once('chat_response', (response) => {
    clearTimeout(timeout);
    if (callback) {
      callback(null, response);
    }
  });
};

// Send Gemini AI request via Socket.IO
export const sendGeminiRequestViaSocket = (message, conversationHistory, callback) => {
  const currentSocket = getSocket();
  
  if (!isSocketConnected()) {
    console.warn('Socket not connected, using direct Gemini API...');
    if (callback) {
      callback(new Error('Socket not connected'), null);
    }
    return;
  }

  // Emit Gemini request to backend
  currentSocket.emit('gemini_request', {
    message: message,
    history: conversationHistory.slice(-5), // Last 5 messages for context
    timestamp: new Date().toISOString()
  });

  // Handle timeout
  const timeout = setTimeout(() => {
    if (callback) {
      callback(new Error('Gemini response timeout'), null);
    }
  }, 30000); // 30 second timeout

  // Listen for Gemini response (single listener that handles both response and timeout clearing)
  currentSocket.once('gemini_response', (response) => {
    clearTimeout(timeout);
    if (response.error) {
      if (callback) {
        callback(new Error(response.error), null);
      }
    } else {
      if (callback) {
        callback(null, response.text || response.message);
      }
    }
  });
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
    console.log('Socket disconnected');
  }
};

// Listen for real-time updates
export const onRealtimeUpdate = (eventName, callback) => {
  const currentSocket = getSocket();
  currentSocket.on(eventName, callback);
};

// Remove event listener
export const offRealtimeUpdate = (eventName, callback) => {
  const currentSocket = getSocket();
  if (currentSocket) {
    currentSocket.off(eventName, callback);
  }
};

export default {
  initializeSocket,
  getSocket,
  isSocketConnected,
  sendMessageViaSocket,
  sendGeminiRequestViaSocket,
  disconnectSocket,
  onRealtimeUpdate,
  offRealtimeUpdate
};

