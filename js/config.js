// Configuration settings
const CONFIG = {
  // API Key for Hugging Face (loaded from .env file)
  API_KEY: process.env.HUGGING_FACE_API_KEY || "",

  // API endpoint
  API_ENDPOINT: "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",

  // Local storage keys
  STORAGE_KEYS: {
    SAVED_SONGS: "savedSongs",
    DARK_MODE: "darkMode",
  },

  // Toast display duration in milliseconds
  TOAST_DURATION: 3000,
}

// Debug logging
console.log('Environment variables:', {
  HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY ? 'Set' : 'Not set',
});

// Export the config
module.exports = CONFIG;

