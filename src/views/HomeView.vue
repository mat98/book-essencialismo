<template>
  <div class="home">
    <section class="hero">
      <div class="hero-ornament">◎</div>
      <h1 class="hero-title">Essencialismo</h1>
      <p class="hero-subtitle">A disciplinada busca por menos</p>
      <blockquote class="hero-motto">"Faça menos, porém melhor."</blockquote>
      <p class="hero-desc">{{ bookData.description }}</p>

      <div class="hero-stats" v-if="totalNotes > 0">
        <div class="stat">
          <span class="stat-value">{{ totalNotes }}</span>
          <span class="stat-label">{{ totalNotes === 1 ? 'capítulo anotado' : 'capítulos anotados' }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-value">{{ totalChapters }}</span>
          <span class="stat-label">capítulos no total</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-value">{{ progressPercent }}%</span>
          <span class="stat-label">progresso</span>
        </div>
      </div>
    </section>

    <section class="parts">
      <div
        v-for="part in bookData.parts"
        :key="part.id"
        class="part-card"
        :style="{ '--part-color': part.color }"
      >
        <div class="part-header">
          <span class="part-icon">{{ part.icon }}</span>
          <div>
            <h2 class="part-title">{{ part.title }}</h2>
            <p class="part-subtitle">{{ part.subtitle }}</p>
          </div>
          <div class="part-progress">
            <span class="part-count">{{ getPartNotesCount(part) }}/{{ part.chapters.length }}</span>
          </div>
        </div>

        <div class="chapters-list">
          <button
            v-for="chapter in part.chapters"
            :key="chapter.id"
            class="chapter-item"
            :class="{ 'has-note': hasNote(chapter.id) }"
            @click="emit('select-chapter', chapter.id)"
          >
            <span class="chapter-num">{{ String(chapter.id).padStart(2, '0') }}</span>
            <div class="chapter-info">
              <span class="chapter-title">{{ chapter.title }}</span>
              <span v-if="hasNote(chapter.id)" class="chapter-note-preview">
                {{ getNotePreview(chapter.id) }}
              </span>
            </div>
            <div class="chapter-meta">
              <StarRating v-if="getNote(chapter.id).rating" :value="getNote(chapter.id).rating" readonly size="sm" />
              <span class="chapter-arrow">→</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { bookData, allChapters } from '../data/book.js'
import { useNotes } from '../stores/notes.js'
import StarRating from '../components/StarRating.vue'

const emit = defineEmits(['select-chapter'])

const { getNote, notesWithContent, totalNotes } = useNotes()

const totalChapters = allChapters.length

const progressPercent = computed(() =>
  Math.round((totalNotes.value / totalChapters) * 100)
)

function hasNote(chapterId) {
  const n = getNote(chapterId)
  return !!(n.text || (n.highlights && n.highlights.length) || n.rating)
}

function getNotePreview(chapterId) {
  const n = getNote(chapterId)
  if (!n.text) return ''
  return n.text.length > 80 ? n.text.slice(0, 80) + '…' : n.text
}

function getPartNotesCount(part) {
  return part.chapters.filter((ch) => hasNote(ch.id)).length
}
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.hero {
  text-align: center;
  padding: 40px 0 56px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 48px;
}

.hero-ornament {
  font-size: 40px;
  color: var(--accent);
  margin-bottom: 16px;
  display: block;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 8px;
}

.hero-subtitle {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 18px;
  color: var(--ink-light);
  margin-bottom: 24px;
}

.hero-motto {
  display: inline-block;
  font-family: var(--font-serif);
  font-size: 20px;
  font-style: italic;
  color: var(--accent);
  border-left: 3px solid var(--accent);
  padding: 8px 0 8px 20px;
  text-align: left;
  margin: 0 auto 24px;
  max-width: 400px;
}

.hero-desc {
  font-size: 15px;
  color: var(--ink-light);
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto 32px;
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  background: var(--cream-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 28px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 11px;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border);
}

.parts {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.part-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: white;
}

.part-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  background: color-mix(in srgb, var(--part-color) 6%, var(--cream));
  border-bottom: 1px solid var(--border);
}

.part-icon {
  font-size: 24px;
  color: var(--part-color);
  line-height: 1;
  flex-shrink: 0;
}

.part-title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.2;
}

.part-subtitle {
  font-size: 12px;
  color: var(--ink-light);
  margin-top: 2px;
  font-style: italic;
}

.part-progress {
  margin-left: auto;
  flex-shrink: 0;
}

.part-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--part-color);
  background: color-mix(in srgb, var(--part-color) 12%, white);
  padding: 4px 10px;
  border-radius: 20px;
}

.chapters-list {
  display: flex;
  flex-direction: column;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  text-align: left;
  border-bottom: 1px solid var(--cream-dark);
  transition: background var(--transition);
  cursor: pointer;
}

.chapter-item:last-child {
  border-bottom: none;
}

.chapter-item:hover {
  background: var(--cream);
}

.chapter-item.has-note {
  background: color-mix(in srgb, var(--part-color) 3%, white);
}

.chapter-item.has-note:hover {
  background: color-mix(in srgb, var(--part-color) 6%, white);
}

.chapter-num {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-faint);
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  width: 22px;
}

.has-note .chapter-num {
  color: var(--part-color);
}

.chapter-info {
  flex: 1;
  min-width: 0;
}

.chapter-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.4;
}

.chapter-note-preview {
  display: block;
  font-size: 12px;
  color: var(--ink-faint);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.chapter-arrow {
  font-size: 14px;
  color: var(--ink-faint);
  transition: transform var(--transition), color var(--transition);
}

.chapter-item:hover .chapter-arrow {
  transform: translateX(3px);
  color: var(--accent);
}
</style>
