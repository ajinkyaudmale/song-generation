import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { theme, artist, language, genre } = await req.json();

    // Verify API key is present
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    if (!apiKey) {
      console.error('API key not found in environment variables');
      throw new Error('API key not configured');
    }

    // Log API request (without sensitive data)
    console.log('Generating song with parameters:', { theme, artist, language, genre });

    // Construct the prompt
    const prompt = `Generate a song with the following criteria:
      Theme: ${theme}
      Style: Similar to ${artist}
      Language: ${language}
      Genre: ${genre}
      
      Please write lyrics that capture the theme while matching the artist's style and the specified genre.
      Format the output with clear sections (Verse 1, Chorus, etc.).`;

    // Call Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (!Array.isArray(result) || !result[0]?.generated_text) {
      console.error('Invalid response format:', result);
      throw new Error('Invalid response format from AI model');
    }

    return NextResponse.json({
      success: true,
      song: result[0].generated_text,
      metadata: {
        theme,
        artist,
        language,
        genre,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error('Song generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate song', 
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

