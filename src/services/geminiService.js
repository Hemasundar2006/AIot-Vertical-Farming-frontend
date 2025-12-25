import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/gemini';
import { knowledgeBase } from '../utils/verticalFarmingKnowledgeBase';
import { sendGeminiRequestViaSocket, isSocketConnected } from './socketService';
import { sendChatMessage, isBackendApiAvailable } from './chatbotApiService';

// Initialize Gemini AI
let genAI;
let model;

try {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-pro' });
} catch (error) {
  console.error('Error initializing Gemini AI:', error);
}

// Create context from knowledge base
const createContext = () => {
  let context = "You are a Vertical Farming AI Assistant. You have access to comprehensive knowledge about vertical farming. ";
  context += "Answer questions based on the following knowledge base:\n\n";
  
  // Add key information from knowledge base
  for (const [key, section] of Object.entries(knowledgeBase)) {
    context += `\n${section.content}\n`;
  }
  
  context += "\n\nIMPORTANT INSTRUCTIONS:\n";
  context += "1. Answer ONLY the specific question asked. Do NOT provide lists of topics or categories.\n";
  context += "2. Be concise and direct - give 2-4 paragraphs maximum unless the user asks for more detail.\n";
  context += "3. Use bullet points ONLY when listing specific items (like crops, benefits, etc.), not for showing topic categories.\n";
  context += "4. If you don't have information about something, simply say 'I don't have specific information about that in my knowledge base' and suggest related topics you CAN help with.\n";
  context += "5. Be conversational and natural - respond like a helpful expert, not like a documentation index.\n";
  context += "6. Never show topic lists like 'Basics and definitions', 'How it works', etc. - just answer the question directly.\n";
  context += "7. If asked about topics outside vertical farming, politely say you specialize in vertical farming and redirect.\n";
  context += "8. Keep responses focused and relevant to the exact question asked.\n";
  
  return context;
};

const systemContext = createContext();

// Generate response using Gemini AI (with multiple transport options)
export async function generateGeminiResponse(userMessage, conversationHistory = [], useSocket = false, useHttpApi = false) {
  // Try HTTP API first if requested and available
  if (useHttpApi) {
    try {
      const isAvailable = await isBackendApiAvailable();
      if (isAvailable) {
        console.log('✅ Using HTTP API for chat');
        const response = await sendChatMessage(userMessage, conversationHistory);
        return response;
      } else {
        console.warn('HTTP API not available, trying other methods...');
      }
    } catch (httpError) {
      console.warn('HTTP API request failed, trying other methods:', httpError.message);
      // Fall through to other methods
    }
  }

  // Try Socket.IO if requested and connected
  if (useSocket && isSocketConnected()) {
    try {
      return await new Promise((resolve, reject) => {
        sendGeminiRequestViaSocket(userMessage, conversationHistory, (error, response) => {
          if (error) {
            console.warn('Socket.IO request failed, falling back to direct API:', error.message);
            reject(error);
          } else {
            console.log('✅ Response received via Socket.IO');
            resolve(response);
          }
        });
      });
    } catch (socketError) {
      console.warn('Socket.IO failed, using direct Gemini API...');
      // Fall through to direct API call
    }
  }

  // Direct Gemini API call (fallback or default)
  try {
    if (!model) {
      throw new Error('Gemini AI not initialized. Please check your API key.');
    }

    // Build conversation context
    let prompt = systemContext + "\n\n";
    
    // Add conversation history for context (last 5 messages)
    if (conversationHistory.length > 0) {
      prompt += "Previous conversation:\n";
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        prompt += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
      });
      prompt += "\n";
    }
    
    prompt += `User: ${userMessage}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    
    // Return helpful error message
    if (error.message.includes('API key')) {
      return "⚠️ API Key Error: Please configure your Gemini API key in src/config/gemini.js to use live AI responses. The chatbot will continue to work with the built-in knowledge base.";
    }
    
    return "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment, or I can answer from my built-in knowledge base.";
  }
}

// Check if Gemini is properly configured
export function isGeminiConfigured() {
  return GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE' && model !== null;
}

