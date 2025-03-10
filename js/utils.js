// Utility functions

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} unsafe - The unsafe string
 * @returns {string} - The escaped string
 */
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showToast(message, isError = false) {
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toastMessage")

  toastMessage.textContent = message
  toast.className = isError ? "toast bg-red-500" : "toast"
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, CONFIG.TOAST_DURATION)
}

/**
 * Show or hide the loading overlay
 * @param {boolean} show - Whether to show the loading overlay
 */
function showLoading(show) {
  const loadingOverlay = document.getElementById("loadingOverlay")
  const generateBtn = document.getElementById("generateBtn")

  if (show) {
    loadingOverlay.classList.remove("hidden")
    generateBtn.disabled = true
  } else {
    loadingOverlay.classList.add("hidden")
    generateBtn.disabled = false
  }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark")
  localStorage.setItem(CONFIG.STORAGE_KEYS.DARK_MODE, document.documentElement.classList.contains("dark"))
}

/**
 * Switch between tabs
 * @param {string} tab - The tab to switch to ('current' or 'saved')
 */
function switchTab(tab) {
  const currentTabBtn = document.getElementById("currentTabBtn")
  const savedTabBtn = document.getElementById("savedTabBtn")
  const currentSongTab = document.getElementById("currentSongTab")
  const savedSongsTab = document.getElementById("savedSongsTab")

  if (tab === "current") {
    currentTabBtn.classList.add("border-primary", "text-primary")
    currentTabBtn.classList.remove("border-transparent", "text-gray-500")
    savedTabBtn.classList.add("border-transparent", "text-gray-500")
    savedTabBtn.classList.remove("border-primary", "text-primary")
    currentSongTab.classList.remove("hidden")
    savedSongsTab.classList.add("hidden")
  } else {
    savedTabBtn.classList.add("border-primary", "text-primary")
    savedTabBtn.classList.remove("border-transparent", "text-gray-500")
    currentTabBtn.classList.add("border-transparent", "text-gray-500")
    currentTabBtn.classList.remove("border-primary", "text-primary")
    savedSongsTab.classList.remove("hidden")
    currentSongTab.classList.add("hidden")
  }
}

const CONFIG = {
  TOAST_DURATION: 3000,
  STORAGE_KEYS: {
    DARK_MODE: "darkMode",
  },
}

