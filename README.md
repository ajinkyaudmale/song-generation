# AI Song Generator

A web application that generates songs using AI, built with Next.js and the Hugging Face API.

## Features

- Generate songs based on theme, language, and artist style
- Powered by Mistral AI model
- Modern UI with responsive design
- Built with Next.js and TypeScript

## Live Demo

Visit the live demo at: [https://ajinkyaudmale.github.io/songs](https://ajinkyaudmale.github.io/songs)

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/ajinkyaudmale/songs.git
cd songs
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

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment process:

1. Builds the Next.js application
2. Uploads the built files to GitHub Pages
3. Deploys the site to the configured domain

## Environment Variables

- `HUGGING_FACE_API_KEY`: Your Hugging Face API key (required)

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Hugging Face API
- GitHub Actions
- GitHub Pages

## License

MIT
