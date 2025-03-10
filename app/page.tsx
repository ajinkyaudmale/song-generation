import SongGenerator from "@/components/song-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            AI Song Generator
          </h1>
          <p className="text-muted-foreground mt-2">Create songs in the style of your favorite artists</p>
        </header>
        <SongGenerator />
      </div>
    </main>
  )
}

