"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateSong } from "@/lib/generate-song"
import { Loader2, Music, Copy, Save, Check, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

// Define types for our song data
type Song = {
  title: string
  lyrics: string
  artist: string
  theme: string
  language: string
  genre: string
  timestamp: number
}

export default function SongGenerator() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState("")
  const [language, setLanguage] = useState("English")
  const [artist, setArtist] = useState("")
  const [genre, setGenre] = useState("Pop")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [savedSongs, setSavedSongs] = useState<Song[]>([])
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load saved songs from localStorage on component mount
  useEffect(() => {
    if (mounted) {
      const saved = localStorage.getItem("savedSongs")
      if (saved) {
        try {
          setSavedSongs(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse saved songs", e)
        }
      }
    }
  }, [mounted])

  // Save songs to localStorage when they change
  useEffect(() => {
    if (mounted && savedSongs.length > 0) {
      localStorage.setItem("savedSongs", JSON.stringify(savedSongs))
    }
  }, [savedSongs, mounted])

  if (!mounted) {
    return null // or a loading spinner
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setCopied(false)

    try {
      const result = await generateSong(theme, language, artist, genre)

      setCurrentSong({
        title: result.title,
        lyrics: result.lyrics,
        artist,
        theme,
        language,
        genre,
        timestamp: Date.now(),
      })

      toast({
        title: "Song generated!",
        description: `"${result.title}" in the style of ${artist}`,
      })
    } catch (err) {
      toast({
        title: "Failed to generate song",
        description: "Please try again with different parameters",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLyrics = () => {
    if (!currentSong) return

    navigator.clipboard.writeText(`${currentSong.title}\n\n${currentSong.lyrics}`)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: "Song lyrics copied to clipboard",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveSong = () => {
    if (!currentSong) return

    setSavedSongs((prev) => [currentSong, ...prev])

    toast({
      title: "Song saved",
      description: "Added to your saved songs",
    })
  }

  const handleDeleteSong = (timestamp: number) => {
    setSavedSongs((prev) => prev.filter((song) => song.timestamp !== timestamp))

    toast({
      title: "Song deleted",
      description: "Removed from your saved songs",
    })
  }

  const handleLoadSong = (song: Song) => {
    setCurrentSong(song)
    setTheme(song.theme)
    setLanguage(song.language)
    setArtist(song.artist)
    setGenre(song.genre)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Song Theme</Label>
                <Input
                  id="theme"
                  placeholder="love, heartbreak, adventure, etc."
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist">Reference Artist</Label>
                <Input
                  id="artist"
                  placeholder="Taylor Swift, Drake, Bob Dylan, etc."
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage} required>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Select value={genre} onValueChange={setGenre} required>
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pop">Pop</SelectItem>
                    <SelectItem value="Rock">Rock</SelectItem>
                    <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                    <SelectItem value="R&B">R&B</SelectItem>
                    <SelectItem value="Country">Country</SelectItem>
                    <SelectItem value="Electronic">Electronic</SelectItem>
                    <SelectItem value="Jazz">Jazz</SelectItem>
                    <SelectItem value="Classical">Classical</SelectItem>
                    <SelectItem value="Folk">Folk</SelectItem>
                    <SelectItem value="Reggae">Reggae</SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                    <SelectItem value="Blues">Blues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isGenerating} size="lg">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Your Song...
                </>
              ) : (
                <>
                  <Music className="mr-2 h-5 w-5" />
                  Generate Song
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="current">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Song</TabsTrigger>
          <TabsTrigger value="saved">Saved Songs ({savedSongs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-4">
          {currentSong ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                  <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                  <p className="opacity-90">In the style of {currentSong.artist}</p>
                </div>
                <CardContent className="pt-6">
                  <div className="flex justify-end space-x-2 mb-4">
                    <Button variant="outline" size="sm" onClick={handleCopyLyrics}>
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? "Copied" : "Copy Lyrics"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSaveSong}>
                      <Save className="h-4 w-4 mr-1" />
                      Save Song
                    </Button>
                  </div>
                  <div className="whitespace-pre-wrap bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto font-serif leading-relaxed">
                    {currentSong.lyrics}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Theme: {currentSong.theme} • Genre: {currentSong.genre} • Language: {currentSong.language}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Generate a song to see it here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          {savedSongs.length > 0 ? (
            <div className="space-y-4">
              {savedSongs.map((song) => (
                <Card key={song.timestamp} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
                    <h3 className="text-xl font-bold">{song.title}</h3>
                    <p className="opacity-90">In the style of {song.artist}</p>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-end space-x-2 mb-2">
                      <Button variant="outline" size="sm" onClick={() => handleLoadSong(song)}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Load
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteSong(song.timestamp)}>
                        Delete
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <p>
                        Theme: {song.theme} • Genre: {song.genre} • Language: {song.language}
                      </p>
                    </div>
                    <div className="whitespace-pre-wrap bg-muted p-4 rounded-md max-h-[200px] overflow-y-auto font-serif text-sm">
                      {song.lyrics.substring(0, 200)}...
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Save className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No saved songs yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

