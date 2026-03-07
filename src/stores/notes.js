import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'essencialismo_notes'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage unavailable
  }
}

const state = reactive({
  notes: loadFromStorage(),
  searchQuery: '',
  activeChapterId: null,
  activeView: 'home', // 'home' | 'chapter' | 'search' | 'all-notes'
})

watch(
  () => state.notes,
  (val) => saveToStorage(val),
  { deep: true }
)

export function useNotes() {
  function getNote(chapterId) {
    return state.notes[chapterId] || { text: '', highlights: [], rating: 0, createdAt: null, updatedAt: null }
  }

  function saveNote(chapterId, text) {
    const existing = state.notes[chapterId] || {}
    state.notes[chapterId] = {
      ...existing,
      text,
      updatedAt: Date.now(),
      createdAt: existing.createdAt || Date.now(),
    }
  }

  function setRating(chapterId, rating) {
    const existing = state.notes[chapterId] || { text: '', createdAt: Date.now() }
    state.notes[chapterId] = { ...existing, rating, updatedAt: Date.now() }
  }

  function toggleHighlight(chapterId, idea) {
    const existing = state.notes[chapterId] || { text: '', createdAt: Date.now(), highlights: [] }
    const highlights = existing.highlights || []
    const idx = highlights.indexOf(idea)
    state.notes[chapterId] = {
      ...existing,
      highlights: idx >= 0 ? highlights.filter((h) => h !== idea) : [...highlights, idea],
      updatedAt: Date.now(),
    }
  }

  function deleteNote(chapterId) {
    delete state.notes[chapterId]
  }

  const notesWithContent = computed(() =>
    Object.entries(state.notes)
      .filter(([, n]) => n.text || (n.highlights && n.highlights.length) || n.rating)
      .map(([id, n]) => ({ chapterId: parseInt(id), ...n }))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  )

  const totalNotes = computed(() => notesWithContent.value.length)

  function setActiveChapter(id) {
    state.activeChapterId = id
    state.activeView = id ? 'chapter' : 'home'
  }

  function setView(view) {
    state.activeView = view
    if (view !== 'chapter') state.activeChapterId = null
  }

  return {
    state,
    getNote,
    saveNote,
    setRating,
    toggleHighlight,
    deleteNote,
    notesWithContent,
    totalNotes,
    setActiveChapter,
    setView,
  }
}
