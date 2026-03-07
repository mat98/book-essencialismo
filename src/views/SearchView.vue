<template>
  <div class="search-view">
    <div class="results-header" v-if="query">
      <p class="results-count">
        <span v-if="results.length">{{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }} para</span>
        <span v-else>Nenhum resultado para</span>
        <strong>"{{ query }}"</strong>
      </p>
    </div>

    <div v-else class="search-prompt">
      <span class="prompt-icon">◎</span>
      <p>Digite na barra de busca acima para encontrar capítulos, ideias e anotações.</p>
    </div>

    <div v-if="results.length" class="results-list">
      <button
        v-for="result in results"
        :key="result.id"
        class="result-item"
        :style="{ '--r-color': result.partColor }"
        @click="emit('select-chapter', result.id)"
      >
        <div class="result-header">
          <span class="result-part">{{ result.partTitle }}</span>
          <span class="result-num">Cap. {{ result.id }}</span>
        </div>
        <h3 class="result-title" v-html="highlight(result.title, query)"></h3>
        <p class="result-summary" v-html="highlight(truncate(result.summary), query)"></p>
        <div v-if="result.matchedIdeas.length" class="result-ideas">
          <span
            v-for="idea in result.matchedIdeas"
            :key="idea"
            class="result-idea"
            v-html="highlight(idea, query)"
          ></span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { allChapters } from '../data/book.js'
import { useNotes } from '../stores/notes.js'

const props = defineProps({ query: String })
const emit = defineEmits(['select-chapter'])

const { getNote } = useNotes()

const results = computed(() => {
  const q = (props.query || '').toLowerCase().trim()
  if (!q) return []

  return allChapters
    .map((ch) => {
      const note = getNote(ch.id)
      const titleMatch = ch.title.toLowerCase().includes(q)
      const summaryMatch = ch.summary.toLowerCase().includes(q)
      const quoteMatch = ch.quote.toLowerCase().includes(q)
      const noteMatch = note.text && note.text.toLowerCase().includes(q)
      const matchedIdeas = ch.keyIdeas.filter((i) => i.toLowerCase().includes(q))

      if (titleMatch || summaryMatch || quoteMatch || noteMatch || matchedIdeas.length) {
        return { ...ch, matchedIdeas, score: (titleMatch ? 3 : 0) + (matchedIdeas.length * 2) + (summaryMatch ? 1 : 0) + (noteMatch ? 1 : 0) }
      }
      return null
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
})

function highlight(text, query) {
  if (!query || !text) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
}

function truncate(text, len = 120) {
  return text.length > len ? text.slice(0, len) + '…' : text
}
</script>

<style scoped>
.search-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

.results-header {
  margin-bottom: 24px;
}

.results-count {
  font-size: 14px;
  color: var(--ink-light);
}

.results-count strong {
  color: var(--ink);
  margin-left: 4px;
}

.search-prompt {
  text-align: center;
  padding: 80px 24px;
  color: var(--ink-light);
  font-size: 15px;
}

.prompt-icon {
  display: block;
  font-size: 48px;
  color: var(--accent-muted);
  margin-bottom: 16px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  text-align: left;
  background: white;
  border: 1px solid var(--border);
  border-left: 3px solid var(--r-color);
  border-radius: var(--radius);
  padding: 20px;
  cursor: pointer;
  transition: box-shadow var(--transition), transform var(--transition);
}

.result-item:hover {
  box-shadow: 0 4px 16px var(--shadow);
  transform: translateY(-1px);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.result-part {
  font-size: 11px;
  font-weight: 500;
  color: var(--r-color);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.result-num {
  font-size: 11px;
  color: var(--ink-faint);
}

.result-title {
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8px;
  line-height: 1.3;
}

.result-summary {
  font-size: 13px;
  color: var(--ink-light);
  line-height: 1.6;
  margin-bottom: 10px;
}

.result-ideas {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.result-idea {
  font-size: 12px;
  color: var(--r-color);
  background: color-mix(in srgb, var(--r-color) 8%, var(--cream));
  padding: 3px 10px;
  border-radius: 20px;
}

:deep(mark) {
  background: var(--accent-muted);
  color: var(--ink);
  border-radius: 2px;
  padding: 0 2px;
}
</style>
