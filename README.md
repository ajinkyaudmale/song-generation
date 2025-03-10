# AI Song Generator

A web application that generates songs in the style of your favorite artists using AI.

## Features

- Generate songs based on theme, artist style, language, and genre
- Save generated songs locally
- Dark/Light theme support
- Responsive design
- Copy lyrics to clipboard
- View saved song history

## Tech Stack

- Next.js 13
- TypeScript
- Tailwind CSS
- Hugging Face API (Mistral-7B-Instruct-v0.2)
- Framer Motion for animations

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/song-generator.git
cd song-generator
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Hugging Face API key:

```
HUGGING_FACE_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `HUGGING_FACE_API_KEY`: Your Hugging Face API key

## Contributing

Feel free to open issues and pull requests!
