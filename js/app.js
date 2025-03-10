// Import necessary modules and functions
import {
  showLoading,
  generateSong,
  updateCurrentSongUI,
  showToast,
  CONFIG,
  toggleDarkMode,
  switchTab,
  updateSavedSongsUI,
} from "./utils.js"

// Main application logic

// Application state
const appState = {
  currentSong: null,
  savedSongs: [],
}

// Event handlers

/**
 * Handle form submission
 * @param {Event} e - The form submission event
 */
async function handleFormSubmit(e) {
  e.preventDefault()

  const theme = document.getElementById("theme").value
  const language = document.getElementById("language").value
  const artist = document.getElementById("artist").value
  const genre = document.getElementById("genre").value

  if (!theme || !artist) return

  showLoading(true)

  try {
    const song = await generateSong(theme, language, artist, genre)
    appState.currentSong = {
      title: song.title,
      lyrics: song.lyrics,
      artist,
      theme,
      language,
      genre,
      timestamp: Date.now(),
    }

    updateCurrentSongUI()
    showToast(`"${song.title}" generated successfully!`)
  } catch (err) {
    console.error("Error generating song:", err)
    showToast("Failed to generate song. Please try again.", true)
  } finally {
    showLoading(false)
  }
}

/**
 * Copy current song to clipboard
 */
function copyCurrentSong() {
  if (!appState.currentSong) return

  const textToCopy = `${appState.currentSong.title}\n\n${appState.currentSong.lyrics}`
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      showToast("Song copied to clipboard")
    })
    .catch((err) => {
      console.error("Failed to copy: ", err)
      showToast("Failed to copy to clipboard", true)
    })
}

/**
 * Save current song
 */
function saveCurrentSong() {
  if (!appState.currentSong) return

  // Check if song already exists
  const exists = appState.savedSongs.some((song) => song.timestamp === appState.currentSong.timestamp)
  if (!exists) {
    appState.savedSongs.unshift(appState.currentSong)
    localStorage.setItem(CONFIG.STORAGE_KEYS.SAVED_SONGS, JSON.stringify(appState.savedSongs))
    updateSavedSongsUI()
    showToast("Song saved to your collection")
  } else {
    showToast("This song is already saved")
  }
}

/**
 * Load a saved song
 * @param {number} timestamp - The timestamp of the song to load
 */
function loadSavedSong(timestamp) {
  const song = appState.savedSongs.find((s) => s.timestamp === timestamp)
  if (song) {
    appState.currentSong = song

    // Update form fields
    document.getElementById("theme").value = song.theme
    document.getElementById("language").value = song.language
    document.getElementById("artist").value = song.artist
    document.getElementById("genre").value = song.genre

    updateCurrentSongUI()
    switchTab("current")
    showToast("Song loaded")
  }
}

/**
 * Delete a saved song
 * @param {number} timestamp - The timestamp of the song to delete
 */
function deleteSavedSong(timestamp) {
  appState.savedSongs = appState.savedSongs.filter((song) => song.timestamp !== timestamp)
  localStorage.setItem(CONFIG.STORAGE_KEYS.SAVED_SONGS, JSON.stringify(appState.savedSongs))
  updateSavedSongsUI()
  showToast("Song deleted")
}

/**
 * Initialize the application
 */
function initApp() {
  // Load saved songs from localStorage
  const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.SAVED_SONGS)
  if (saved) {
    try {
      appState.savedSongs = JSON.parse(saved)
      updateSavedSongsUI()
    } catch (e) {
      console.error("Failed to parse saved songs", e)
    }
  }

  // Check for dark mode preference
  if (
    localStorage.getItem(CONFIG.STORAGE_KEYS.DARK_MODE) === "true" ||
    (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches &&
      localStorage.getItem(CONFIG.STORAGE_KEYS.DARK_MODE) !== "false")
  ) {
    document.documentElement.classList.add("dark")
  }

  // Add event listeners
  document.getElementById("songForm").addEventListener("submit", handleFormSubmit)
  document.getElementById("currentTabBtn").addEventListener("click", () => switchTab("current"))
  document.getElementById("savedTabBtn").addEventListener("click", () => switchTab("saved"))
  document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode)
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)

