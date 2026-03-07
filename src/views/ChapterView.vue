<template>
  <div class="chapter-view">
    <div class="chapter-nav">
      <button class="back-btn" @click="emit('back')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
        Voltar
      </button>

      <div class="nav-siblings">
        <button v-if="prevChapter" class="sibling-btn" @click="emit('select-chapter', prevChapter.id)" title="Anterior">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <span class="chapter-position">{{ chapterIndex + 1 }} / {{ total }}</span>
        <button v-if="nextChapter" class="sibling-btn" @click="emit('select-chapter', nextChapter.id)" title="Próximo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,6 15,12 9,18"/>
          </svg>
        </button>
      </div>
    </div>

    <article class="chapter-article" :style="{ '--ch-color': part.color }">
      <header class="chapter-header">
        <div class="chapter-breadcrumb">
          <span class="part-icon">{{ part.icon }}</span>
          <span class="part-name">{{ part.title }}</span>
        </div>
        <div class="chapter-num-label">Capítulo {{ chapter.id }}</div>
        <h1 class="chapter-title">{{ chapter.title }}</h1>

        <div class="chapter-rating">
          <span class="rating-label">Avaliação pessoal:</span>
          <StarRating v-model="localRating" @update:modelValue="handleRating" />
        </div>
      </header>

      <section class="chapter-summary">
        <h2 class="section-heading">Resumo</h2>
        <p>{{ chapter.summary }}</p>
      </section>

      <section class="chapter-quote">
        <blockquote>
          <p>{{ chapter.quote }}</p>
        </blockquote>
      </section>

      <section class="chapter-ideas">
        <h2 class="section-heading">Ideias-chave</h2>
        <p class="ideas-hint">Clique para destacar as mais importantes para você</p>
        <ul class="ideas-list">
          <li
            v-for="idea in chapter.keyIdeas"
            :key="idea"
            class="idea-item"
            :class="{ highlighted: isHighlighted(idea) }"
            @click="toggleHighlight(idea)"
          >
            <span class="idea-dot">{{ isHighlighted(idea) ? '◆' : '◇' }}</span>
            <span>{{ idea }}</span>
          </li>
        </ul>
      </section>

      <section class="chapter-notes">
        <h2 class="section-heading">
          Minhas anotações
          <span v-if="note.updatedAt" class="note-date">
            atualizado {{ formatDate(note.updatedAt) }}
          </span>
        </h2>
        <div class="textarea-wrapper">
          <textarea
            v-model="localText"
            placeholder="Escreva suas reflexões, insights, aplicações práticas..."
            @input="handleInput"
            rows="8"
          />
          <div class="textarea-footer">
            <span class="char-count">{{ localText.length }} caracteres</span>
            <span v-if="saved" class="saved-indicator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              Salvo
            </span>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { allChapters, bookData } from '../data/book.js'
import { useNotes } from '../stores/notes.js'
import StarRating from '../components/StarRating.vue'

const props = defineProps({ chapterId: Number })
const emit = defineEmits(['back', 'select-chapter'])

const { getNote, saveNote, setRating, toggleHighlight: storeToggle } = useNotes()

const chapter = computed(() => allChapters.find((c) => c.id === props.chapterId))
const part = computed(() => bookData.parts.find((p) => p.id === chapter.value?.part))
const note = computed(() => getNote(props.chapterId))

const chapterIndex = computed(() => allChapters.findIndex((c) => c.id === props.chapterId))
const total = allChapters.length
const prevChapter = computed(() => allChapters[chapterIndex.value - 1] || null)
const nextChapter = computed(() => allChapters[chapterIndex.value + 1] || null)

const localText = ref(note.value.text || '')
const localRating = ref(note.value.rating || 0)
const saved = ref(false)
let saveTimer = null

watch(
  () => props.chapterId,
  () => {
    localText.value = note.value.text || ''
    localRating.value = note.value.rating || 0
    saved.value = false
  }
)

function handleInput() {
  saved.value = false
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveNote(props.chapterId, localText.value)
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
  }, 600)
}

function handleRating(val) {
  localRating.value = val
  setRating(props.chapterId, val)
}

function isHighlighted(idea) {
  return (note.value.highlights || []).includes(idea)
}

function toggleHighlight(idea) {
  storeToggle(props.chapterId, idea)
}

function formatDate(ts) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(ts))
}
</script>

<style scoped>
.chapter-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 24px 80px;
}

.chapter-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-light);
  padding: 6px 12px;
  border-radius: var(--radius);
  transition: background var(--transition), color var(--transition);
}

.back-btn:hover {
  background: var(--cream-dark);
  color: var(--ink);
}

.nav-siblings {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sibling-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  color: var(--ink-light);
  transition: background var(--transition), color var(--transition);
}

.sibling-btn:hover {
  background: var(--cream-dark);
  color: var(--ink);
}

.chapter-position {
  font-size: 12px;
  color: var(--ink-faint);
  min-width: 40px;
  text-align: center;
}

.chapter-article {
  --ch-color: var(--accent);
}

.chapter-header {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.chapter-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.part-icon {
  color: var(--ch-color);
  font-size: 16px;
}

.part-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--ch-color);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.chapter-num-label {
  font-size: 11px;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.chapter-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 700;
  color: var(--ink);
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin-bottom: 24px;
}

.chapter-rating {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-label {
  font-size: 13px;
  color: var(--ink-light);
}

.section-heading {
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.note-date {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  color: var(--ink-faint);
}

.chapter-summary {
  margin-bottom: 32px;
}

.chapter-summary p {
  font-size: 16px;
  line-height: 1.75;
  color: var(--ink-soft);
}

.chapter-quote {
  margin: 0 0 36px;
}

.chapter-quote blockquote {
  border-left: 3px solid var(--ch-color);
  padding: 12px 0 12px 24px;
  background: color-mix(in srgb, var(--ch-color) 5%, var(--cream));
  border-radius: 0 var(--radius) var(--radius) 0;
}

.chapter-quote blockquote p {
  font-family: var(--font-serif);
  font-size: 18px;
  font-style: italic;
  color: var(--ink);
  line-height: 1.5;
}

.chapter-ideas {
  margin-bottom: 40px;
}

.ideas-hint {
  font-size: 12px;
  color: var(--ink-faint);
  margin-top: -8px;
  margin-bottom: 16px;
  font-style: italic;
}

.ideas-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.idea-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition);
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.5;
  user-select: none;
}

.idea-item:hover {
  background: var(--cream-dark);
  border-color: var(--cream-darker);
}

.idea-item.highlighted {
  background: color-mix(in srgb, var(--ch-color) 8%, white);
  border-color: color-mix(in srgb, var(--ch-color) 30%, var(--border));
  color: var(--ink);
}

.idea-dot {
  color: var(--ch-color);
  flex-shrink: 0;
  margin-top: 1px;
  font-size: 12px;
}

.chapter-notes {
  margin-bottom: 40px;
}

.textarea-wrapper {
  position: relative;
}

textarea {
  width: 100%;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink);
  resize: vertical;
  outline: none;
  transition: border-color var(--transition);
  min-height: 160px;
}

textarea:focus {
  border-color: var(--ch-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ch-color) 12%, transparent);
}

textarea::placeholder {
  color: var(--ink-faint);
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 0 4px;
}

.char-count {
  font-size: 11px;
  color: var(--ink-faint);
}

.saved-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--green-soft);
  font-weight: 500;
}
</style>
