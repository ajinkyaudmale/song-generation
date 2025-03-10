// This file is used on the client side to call our API endpoint
export async function generateSong(
  theme: string,
  language: string,
  artist: string,
  genre: string,
): Promise<{ title: string; lyrics: string; metadata: any }> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        theme,
        language,
        artist,
        genre,
      }),
    })

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to generate song');
    }

    const data = await response.json();
    
    // Extract title and lyrics from the generated text
    const lines = data.song.split('\n').filter((line: string) => line.trim() !== '');
    let title = 'Untitled Song';
    let lyrics = data.song;

    // Try to find a line that looks like a title (short and doesn't start with common section names)
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length < 50 && 
          !trimmedLine.toLowerCase().startsWith('verse') && 
          !trimmedLine.toLowerCase().startsWith('chorus') && 
          !trimmedLine.toLowerCase().startsWith('bridge')) {
        title = trimmedLine;
        lyrics = data.song.substring(data.song.indexOf(title) + title.length).trim();
        break;
      }
    }

    return {
      title,
      lyrics,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error in generateSong:', error);
    throw error;
  }
}

