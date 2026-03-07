<template>
  <article class="chapter-panel" :style="{ '--ch-color': part.color }">
    <header class="ch-header">
      <div class="ch-breadcrumb">
        <span class="ch-part-icon">{{ part.icon }}</span>
        <span class="ch-part-name">{{ part.title }}</span>
      </div>

      <div class="ch-nav">
        <button class="ch-nav-btn" :disabled="!prevChapter" @click="emit('prev')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <span class="ch-position">{{ chapterIndex + 1 }} / {{ total }}</span>
        <button class="ch-nav-btn" :disabled="!nextChapter" @click="emit('next')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,6 15,12 9,18"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="ch-body">
      <div class="ch-num-label">Capítulo {{ chapter.id }}</div>
      <h1 class="ch-title">{{ chapter.title }}</h1>

      <!-- Citação em destaque logo abaixo do título -->
      <blockquote class="ch-quote">
        <p>{{ chapter.quote }}</p>
      </blockquote>

      <section class="ch-section">
        <h2 class="section-label">Resumo</h2>
        <p class="ch-summary">{{ chapter.summary }}</p>
      </section>

      <section class="ch-section">
        <h2 class="section-label">Ideias-chave</h2>
        <p class="ch-hint">Clique para destacar as mais importantes para você</p>
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

      <section v-if="chapter.insight" class="ch-section">
        <h2 class="section-label">Insight do autor</h2>
        <div class="ch-insight">
          <span class="insight-icon">◈</span>
          <p>{{ chapter.insight }}</p>
        </div>
      </section>

      <!-- Navegação inferior -->
      <div class="ch-footer-nav">
        <button v-if="prevChapter" class="footer-nav-btn" @click="emit('prev')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          <div class="footer-nav-info">
            <span class="footer-nav-label">Anterior</span>
            <span class="footer-nav-title">{{ prevChapter.title }}</span>
          </div>
        </button>
        <div v-else></div>
        <button v-if="nextChapter" class="footer-nav-btn footer-nav-btn--right" @click="emit('next')">
          <div class="footer-nav-info footer-nav-info--right">
            <span class="footer-nav-label">Próximo</span>
            <span class="footer-nav-title">{{ nextChapter.title }}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,6 15,12 9,18"/>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { allChapters, bookData } from '../data/book.js'
import { useNotes } from '../stores/notes.js'

const props = defineProps({ chapterId: Number })
const emit = defineEmits(['prev', 'next'])

const { getNote, toggleHighlight: storeToggle } = useNotes()

const chapter = computed(() => allChapters.find((c) => c.id === props.chapterId))
const part = computed(() => bookData.parts.find((p) => p.id === chapter.value?.part))
const note = computed(() => getNote(props.chapterId))

const chapterIndex = computed(() => allChapters.findIndex((c) => c.id === props.chapterId))
const total = allChapters.length
const prevChapter = computed(() => allChapters[chapterIndex.value - 1] || null)
const nextChapter = computed(() => allChapters[chapterIndex.value + 1] || null)

function isHighlighted(idea) {
  return (note.value.highlights || []).includes(idea)
}

function toggleHighlight(idea) {
  storeToggle(props.chapterId, idea)
}
</script>

<style scoped>
.chapter-panel {
  --ch-color: var(--accent);
  padding: 40px 48px 80px;
  max-width: 720px;
  margin: 0 auto;
}

.ch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.ch-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ch-part-icon {
  font-size: 16px;
  color: var(--ch-color);
}

.ch-part-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--ch-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.ch-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ch-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  color: var(--ink-light);
  transition: background var(--transition), color var(--transition);
  cursor: pointer;
}

.ch-nav-btn:hover:not(:disabled) {
  background: var(--cream-dark);
  color: var(--ink);
}

.ch-nav-btn:disabled {
  color: var(--cream-darker);
  cursor: default;
}

.ch-position {
  font-size: 12px;
  color: var(--ink-faint);
  min-width: 36px;
  text-align: center;
}

/* ── Título ─────────────────────────────── */
.ch-num-label {
  font-size: 12px;
  color: var(--ch-color);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  margin-bottom: 10px;
}

.ch-title {
  font-family: var(--font-serif);
  font-size: clamp(28px, 3.5vw, 40px);
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 28px;
}

/* ── Citação ────────────────────────────── */
.ch-quote {
  margin: 0 0 40px;
  padding: 20px 24px;
  border-left: 4px solid var(--ch-color);
  background: color-mix(in srgb, var(--ch-color) 6%, var(--cream));
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.ch-quote p {
  font-family: var(--font-serif);
  font-size: 22px;
  font-style: italic;
  color: var(--ink);
  line-height: 1.5;
}

/* ── Seções ─────────────────────────────── */
.ch-section {
  margin-bottom: 40px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ch-color);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--ch-color) 20%, var(--border));
}

.ch-summary {
  font-size: 17px;
  line-height: 1.85;
  color: var(--ink-soft);
}

/* ── Ideias-chave ───────────────────────── */
.ch-hint {
  font-size: 13px;
  color: var(--ink-faint);
  font-style: italic;
  margin-bottom: 14px;
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
  padding: 14px 18px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition), transform var(--transition);
  font-size: 16px;
  color: var(--ink-soft);
  line-height: 1.5;
  user-select: none;
}

.idea-item:hover {
  background: var(--cream-dark);
  transform: translateX(2px);
}

.idea-item.highlighted {
  background: color-mix(in srgb, var(--ch-color) 8%, white);
  border-color: color-mix(in srgb, var(--ch-color) 35%, var(--border));
  color: var(--ink);
  font-weight: 500;
}

.idea-dot {
  color: var(--ch-color);
  flex-shrink: 0;
  font-size: 12px;
  margin-top: 3px;
}

/* ── Insight ────────────────────────────── */
.ch-insight {
  display: flex;
  gap: 16px;
  background: color-mix(in srgb, var(--ch-color) 5%, var(--cream-dark));
  border: 1px solid color-mix(in srgb, var(--ch-color) 22%, var(--border));
  border-radius: var(--radius-lg);
  padding: 20px 22px;
}

.insight-icon {
  font-size: 20px;
  color: var(--ch-color);
  flex-shrink: 0;
  margin-top: 2px;
}

.ch-insight p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--ink-soft);
  font-style: italic;
}

/* ── Navegação inferior ─────────────────── */
.ch-footer-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}

.footer-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: white;
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition), box-shadow var(--transition);
  max-width: 48%;
  text-align: left;
  color: var(--ink-light);
}

.footer-nav-btn:hover {
  background: var(--cream-dark);
  border-color: var(--ch-color);
  box-shadow: 0 2px 12px var(--shadow);
  color: var(--ink);
}

.footer-nav-btn--right {
  margin-left: auto;
}

.footer-nav-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.footer-nav-info--right {
  text-align: right;
}

.footer-nav-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
}

.footer-nav-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
