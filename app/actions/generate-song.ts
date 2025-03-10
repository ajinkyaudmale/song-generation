"use server"

export async function generateSong(theme: string, language: string, artist: string): Promise<string> {
  const API_KEY = process.env.HUGGING_FACE_API_KEY

  if (!API_KEY) {
    throw new Error("Hugging Face API key is not configured")
  }

  try {
    // Using the Hugging Face Inference API with a text generation model
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        inputs: `<s>[INST] Write a song in the style of ${artist} about ${theme} in ${language} language. Include verses, chorus, and a bridge. Make it sound authentic to the artist's style. [/INST]`,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const result = await response.json()

    // Extract the generated text from the response
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

    return generatedText
  } catch (error) {
    console.error("Error generating song:", error)
    throw new Error("Failed to generate song")
  }
}

