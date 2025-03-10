/**
 * Generate a song using the Hugging Face API
 * @param {string} theme - The song theme
 * @param {string} language - The song language
 * @param {string} artist - The reference artist
 * @param {string} genre - The song genre
 * @returns {Promise<Object>} - The generated song title and lyrics
 */

// Define CONFIG here or import it from a config file
const CONFIG = {
  API_ENDPOINT: "YOUR_API_ENDPOINT", // Replace with your actual API endpoint
  API_KEY: "YOUR_API_KEY", // Replace with your actual API key
}

async function generateSong(theme, language, artist, genre) {
  const prompt = `<s>[INST] 
  Create a song in the style of ${artist} about ${theme} in the ${genre} genre, written in ${language}.
  
  First, generate a creative and catchy title for the song that fits the theme and artist's style.
  
  Then, write the complete song lyrics including:
  - Verses
  - Chorus
  - Bridge (if appropriate for the genre)
  - Any other sections typical for this artist and genre
  
  Make the song structure clear by labeling each section (Verse 1, Chorus, etc.).
  
  Make it sound authentic to ${artist}'s style, using their typical themes, vocabulary, and song structure.
  [/INST]`

  try {
    const response = await fetch(CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONFIG.API_KEY}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.8,
          top_p: 0.95,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const result = await response.json()

    // Extract the generated text
    let generatedText = ""
    if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
      generatedText = result[0].generated_text

      // Clean up the response to extract just the song
      const promptEnd = generatedText.indexOf("[/INST]")
      if (promptEnd !== -1) {
        generatedText = generatedText.substring(promptEnd + 7).trim()
      }
    } else {
      throw new Error("Unexpected API response format")
    }

    // Parse the title and lyrics from the generated text
    let title = "Untitled Song"
    let lyrics = generatedText

    // Try to extract the title from the first line
    const lines = generatedText.split("\n").filter((line) => line.trim() !== "")
    if (lines.length > 0) {
      title = lines[0].replace(/^Title: /, "").trim()
      // Remove the title line from the lyrics if we found it
      lyrics = lines.slice(1).join("\n").trim()
    }

    return { title, lyrics }
  } catch (error) {
    console.error("Error generating song:", error)
    throw error
  }
}

// API Configuration
const API = {
  // Generate song endpoint
  async generateSong(theme, artist, language, genre) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          artist,
          language,
          genre,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate song');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating song:', error);
      throw error;
    }
  },

  // Test API connection
  async testConnection() {
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      console.log('API Connection Test:', data);
      return data;
    } catch (error) {
      console.error('API Connection Test Failed:', error);
      throw error;
    }
  }
};

// Export the API
module.exports = API;

