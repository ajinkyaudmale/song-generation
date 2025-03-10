// UI-related functions

// Mock appState, escapeHtml, copyCurrentSong, saveCurrentSong, loadSavedSong, deleteSavedSong for demonstration
const appState = {
  currentSong: null,
  savedSongs: [],
}

function escapeHtml(text) {
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }

  return text.replace(/[&<>"']/g, (m) => map[m])
}

function copyCurrentSong() {
  console.log("Copying current song")
}

function saveCurrentSong() {
  console.log("Saving current song")
}

function loadSavedSong(timestamp) {
  console.log("Loading saved song with timestamp:", timestamp)
}

function deleteSavedSong(timestamp) {
  console.log("Deleting saved song with timestamp:", timestamp)
}

/**
 * Update the current song UI
 */
function updateCurrentSongUI() {
  const noCurrentSong = document.getElementById("noCurrentSong")
  const currentSongContent = document.getElementById("currentSongContent")

  if (appState.currentSong) {
    noCurrentSong.classList.add("hidden")
    currentSongContent.classList.remove("hidden")

    currentSongContent.innerHTML = `
      <div class="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 transition-colors duration-200">
        <div class="gradient-bg p-4 text-white">
          <h2 class="text-2xl font-bold">${escapeHtml(appState.currentSong.title)}</h2>
          <p class="opacity-90">In the style of ${escapeHtml(appState.currentSong.artist)}</p>
        </div>
        <div class="p-6">
          <div class="flex justify-end space-x-2 mb-4">
            <button class="copy-btn px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200">
              <i class="fas fa-copy mr-1"></i> Copy
            </button>
            <button class="save-btn px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200">
              <i class="fas fa-save mr-1"></i> Save
            </button>
          </div>
          <div class="text-sm text-gray-600 mb-2 dark:text-gray-400">
            <p>Theme: ${escapeHtml(appState.currentSong.theme)} • Genre: ${escapeHtml(appState.currentSong.genre)} • Language: ${escapeHtml(appState.currentSong.language)}</p>
          </div>
          <div class="song-lyrics bg-gray-50 p-4 rounded-md max-h-[400px] overflow-y-auto text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-200">
            ${escapeHtml(appState.currentSong.lyrics).replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>
    `

    // Add event listeners to the new buttons
    currentSongContent.querySelector(".copy-btn").addEventListener("click", copyCurrentSong)
    currentSongContent.querySelector(".save-btn").addEventListener("click", saveCurrentSong)
  } else {
    noCurrentSong.classList.remove("hidden")
    currentSongContent.classList.add("hidden")
  }
}

/**
 * Update the saved songs UI
 */
function updateSavedSongsUI() {
  const savedCount = document.getElementById("savedCount")
  const noSavedSongs = document.getElementById("noSavedSongs")
  const savedSongsList = document.getElementById("savedSongsList")

  savedCount.textContent = appState.savedSongs.length

  if (appState.savedSongs.length > 0) {
    noSavedSongs.classList.add("hidden")
    savedSongsList.classList.remove("hidden")

    savedSongsList.innerHTML = appState.savedSongs
      .map(
        (song) => `
      <div class="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 transition-colors duration-200" data-timestamp="${song.timestamp}">
        <div class="gradient-bg-blue p-4 text-white">
          <h3 class="text-xl font-bold">${escapeHtml(song.title)}</h3>
          <p class="opacity-90">In the style of ${escapeHtml(song.artist)}</p>
        </div>
        <div class="p-4">
          <div class="flex justify-end space-x-2 mb-2">
            <button class="load-btn px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200">
              <i class="fas fa-sync-alt mr-1"></i> Load
            </button>
            <button class="delete-btn px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200">
              <i class="fas fa-trash mr-1"></i> Delete
            </button>
          </div>
          <div class="text-sm text-gray-600 mb-2 dark:text-gray-400">
            <p>Theme: ${escapeHtml(song.theme)} • Genre: ${escapeHtml(song.genre)} • Language: ${escapeHtml(song.language)}</p>
          </div>
          <div class="song-lyrics bg-gray-50 p-4 rounded-md max-h-[200px] overflow-y-auto text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-200">
            ${escapeHtml(song.lyrics.substring(0, 200))}${song.lyrics.length > 200 ? "..." : ""}
          </div>
        </div>
      </div>
    `,
      )
      .join("")

    // Add event listeners to the new buttons
    savedSongsList.querySelectorAll(".load-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const timestamp = Number.parseInt(e.target.closest("[data-timestamp]").dataset.timestamp)
        loadSavedSong(timestamp)
      })
    })

    savedSongsList.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const timestamp = Number.parseInt(e.target.closest("[data-timestamp]").dataset.timestamp)
        deleteSavedSong(timestamp)
      })
    })
  } else {
    noSavedSongs.classList.remove("hidden")
    savedSongsList.classList.add("hidden")
  }
}

