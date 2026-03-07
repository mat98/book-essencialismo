<template>
  <div class="all-notes">
    <div class="page-header">
      <button class="back-btn" @click="emit('back')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
        Voltar
      </button>
      <h1 class="page-title">Minhas Anotações</h1>
    </div>

    <div v-if="notesWithContent.length === 0" class="empty-state">
      <span class="empty-icon">◎</span>
      <p>Nenhuma anotação ainda.</p>
      <p class="empty-sub">Comece explorando os capítulos do livro.</p>
    </div>

    <div v-else class="notes-list">
      <div
        v-for="item in enrichedNotes"
        :key="item.chapterId"
        class="note-card"
        :style="{ '--note-color': item.partColor }"
      >
        <div class="note-card-header">
          <div class="note-meta">
            <span class="note-part">{{ item.partTitle }}</span>
            <span class="note-sep">·</span>
            <span class="note-chapter">Cap. {{ item.chapterId }}</span>
          </div>
          <div class="note-actions">
            <StarRating v-if="item.rating" :value="item.rating" readonly size="sm" />
            <button class="note-open-btn" @click="emit('select-chapter', item.chapterId)">
              Abrir →
            </button>
          </div>
        </div>

        <h3 class="note-chapter-title">{{ item.chapterTitle }}</h3>

        <div v-if="item.highlights && item.highlights.length" class="note-highlights">
          <span
            v-for="h in item.highlights"
            :key="h"
            class="highlight-tag"
          >◆ {{ h }}</span>
        </div>

        <p v-if="item.text" class="note-text">{{ item.text }}</p>

        <div class="note-footer">
          <span class="note-date">{{ formatDate(item.updatedAt) }}</span>
          <button class="delete-btn" @click="handleDelete(item.chapterId)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
              <path d="M10,11v6M14,11v6"/>
              <path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
            </svg>
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { allChapters } from '../data/book.js'
import { useNotes } from '../stores/notes.js'
import StarRating from '../components/StarRating.vue'

const emit = defineEmits(['back', 'select-chapter'])

const { notesWithContent, deleteNote } = useNotes()

const enrichedNotes = computed(() =>
  notesWithContent.value.map((n) => {
    const ch = allChapters.find((c) => c.id === n.chapterId)
    return { ...n, chapterTitle: ch?.title || '', partTitle: ch?.partTitle || '', partColor: ch?.partColor || 'var(--accent)' }
  })
)

function formatDate(ts) {
  if (!ts) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(ts))
}

function handleDelete(id) {
  if (confirm('Excluir todas as anotações deste capítulo?')) {
    deleteNote(id)
  }
}
</script>

<style scoped>
.all-notes {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 24px 80px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
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

.page-title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 700;
  color: var(--ink);
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
  color: var(--ink-light);
}

.empty-icon {
  display: block;
  font-size: 48px;
  color: var(--accent-muted);
  margin-bottom: 16px;
}

.empty-sub {
  font-size: 14px;
  color: var(--ink-faint);
  margin-top: 8px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  border-left: 3px solid var(--note-color);
}

.note-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--ink-faint);
}

.note-part {
  color: var(--note-color);
  font-weight: 500;
}

.note-sep {
  color: var(--border);
}

.note-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.note-open-btn {
  font-size: 13px;
  font-weight: 500;
  color: var(--note-color);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--note-color) 8%, white);
  transition: background var(--transition);
}

.note-open-btn:hover {
  background: color-mix(in srgb, var(--note-color) 15%, white);
}

.note-chapter-title {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 16px;
  line-height: 1.3;
}

.note-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.highlight-tag {
  font-size: 12px;
  color: var(--note-color);
  background: color-mix(in srgb, var(--note-color) 8%, var(--cream));
  border: 1px solid color-mix(in srgb, var(--note-color) 20%, var(--border));
  padding: 4px 10px;
  border-radius: 20px;
  line-height: 1.4;
}

.note-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink-soft);
  white-space: pre-wrap;
}

.note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--cream-dark);
}

.note-date {
  font-size: 11px;
  color: var(--ink-faint);
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--ink-faint);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: color var(--transition), background var(--transition);
}

.delete-btn:hover {
  color: var(--red-soft);
  background: color-mix(in srgb, var(--red-soft) 8%, white);
}
</style>
