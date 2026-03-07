<template>
  <div class="app">
    <AppHeader
      :show-search="showSearch"
      :search-query="searchQuery"
      @toggle-search="toggleSearch"
      @search="handleSearch"
    />

    <main class="layout">
      <!-- Sidebar: índice de capítulos -->
      <aside class="sidebar">
        <section class="hero">
          <div class="hero-ornament">◎</div>
          <h1 class="hero-title">Essencialismo</h1>
          <p class="hero-subtitle">A disciplinada busca por menos</p>
        </section>

        <Transition name="search-slide">
          <div v-if="showSearch" class="sidebar-search">
            <p v-if="searchResults.length" class="search-count">
              {{ searchResults.length }} resultado{{ searchResults.length !== 1 ? 's' : '' }}
            </p>
            <p v-else-if="searchQuery" class="search-count empty">Nenhum resultado</p>
          </div>
        </Transition>

        <nav class="toc">
          <template v-for="part in bookData.parts" :key="part.id">
            <div
              v-if="!showSearch || partHasResults(part)"
              class="toc-part"
              :style="{ '--part-color': part.color }"
            >
              <div class="toc-part-header">
                <span class="toc-part-icon">{{ part.icon }}</span>
                <span class="toc-part-title">{{ part.title }}</span>
              </div>

              <button
                v-for="chapter in visibleChapters(part)"
                :key="chapter.id"
                class="toc-chapter"
                :class="{ active: activeChapterId === chapter.id }"
                @click="setActive(chapter.id)"
              >
                <span class="toc-num">{{ String(chapter.id).padStart(2, '0') }}</span>
                <span class="toc-title" v-html="highlightText(chapter.title)"></span>
              </button>
            </div>
          </template>
        </nav>
      </aside>

      <!-- Painel de conteúdo -->
      <section class="content-panel">
        <Transition name="fade" mode="out-in">
          <div v-if="!activeChapterId" key="welcome" class="welcome-panel">
            <span class="welcome-ornament">◎</span>
            <h2 class="welcome-title">Essencialismo</h2>
            <p class="welcome-author">Greg McKeown</p>
            <blockquote class="welcome-quote">"Faça menos, porém melhor."</blockquote>
            <p class="welcome-desc">{{ bookData.description }}</p>
            <p class="welcome-hint">Selecione um capítulo ao lado para começar.</p>
          </div>

          <ChapterPanel
            v-else
            :key="activeChapterId"
            :chapter-id="activeChapterId"
            @prev="goToPrev"
            @next="goToNext"
          />
        </Transition>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import ChapterPanel from './components/ChapterPanel.vue'
import { bookData, allChapters } from './data/book.js'

const activeChapterId = ref(null)
const showSearch = ref(false)
const searchQuery = ref('')

const searchResults = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return []
  return allChapters.filter((ch) =>
    ch.title.toLowerCase().includes(q) ||
    ch.summary.toLowerCase().includes(q) ||
    ch.quote.toLowerCase().includes(q) ||
    ch.keyIdeas.some((i) => i.toLowerCase().includes(q)) ||
    (ch.insight && ch.insight.toLowerCase().includes(q))
  )
})

function partHasResults(part) {
  return part.chapters.some((ch) => searchResults.value.find((r) => r.id === ch.id))
}

function visibleChapters(part) {
  if (!showSearch.value || !searchQuery.value) return part.chapters
  return part.chapters.filter((ch) => searchResults.value.find((r) => r.id === ch.id))
}

function highlightText(text) {
  const q = searchQuery.value.trim()
  if (!q || !showSearch.value) return text
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
}

function setActive(id) {
  activeChapterId.value = id
}

function goToPrev() {
  const idx = allChapters.findIndex((c) => c.id === activeChapterId.value)
  if (idx > 0) activeChapterId.value = allChapters[idx - 1].id
}

function goToNext() {
  const idx = allChapters.findIndex((c) => c.id === activeChapterId.value)
  if (idx < allChapters.length - 1) activeChapterId.value = allChapters[idx + 1].id
}

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) searchQuery.value = ''
}

function handleSearch(q) {
  searchQuery.value = q
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: calc(100vh - 60px);
}

/* ── Sidebar ────────────────────────────── */
.sidebar {
  border-right: 1px solid var(--border);
  overflow-y: auto;
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  background: var(--cream);
}

.hero {
  padding: 28px 20px 20px;
  border-bottom: 1px solid var(--border);
  text-align: center;
}

.hero-ornament {
  font-size: 26px;
  color: var(--accent);
  display: block;
  margin-bottom: 8px;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.hero-subtitle {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 12px;
  color: var(--ink-light);
  margin-top: 4px;
}

/* ── Search feedback ────────────────────── */
.sidebar-search {
  padding: 8px 20px;
  border-bottom: 1px solid var(--border);
}

.search-count {
  font-size: 12px;
  color: var(--accent);
  font-weight: 500;
}

.search-count.empty {
  color: var(--ink-faint);
}

.search-slide-enter-active,
.search-slide-leave-active {
  transition: opacity 200ms, max-height 200ms;
  overflow: hidden;
  max-height: 40px;
}

.search-slide-enter-from,
.search-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── TOC ────────────────────────────────── */
.toc {
  padding: 12px 0 40px;
}

.toc-part {
  margin-bottom: 4px;
}

.toc-part-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px 6px;
}

.toc-part-icon {
  font-size: 13px;
  color: var(--part-color);
}

.toc-part-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--part-color);
  text-transform: uppercase;
  letter-spacing: 0.11em;
}

.toc-chapter {
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
  padding: 9px 20px;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition);
  border-left: 2px solid transparent;
}

.toc-chapter:hover {
  background: var(--cream-dark);
}

.toc-chapter.active {
  background: color-mix(in srgb, var(--part-color) 9%, white);
  border-left-color: var(--part-color);
}

.toc-num {
  font-size: 10px;
  font-weight: 600;
  color: var(--ink-faint);
  letter-spacing: 0.06em;
  flex-shrink: 0;
  width: 20px;
  font-variant-numeric: tabular-nums;
}

.toc-chapter.active .toc-num {
  color: var(--part-color);
}

.toc-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.4;
}

.toc-chapter.active .toc-title {
  color: var(--part-color);
  font-weight: 600;
}

:deep(mark) {
  background: var(--accent-muted);
  color: var(--ink);
  border-radius: 2px;
  padding: 0 1px;
}

/* ── Content panel ──────────────────────── */
.content-panel {
  overflow-y: auto;
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
  background: var(--cream);
}

/* ── Welcome ────────────────────────────── */
.welcome-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 60px 48px;
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
}

.welcome-ornament {
  font-size: 52px;
  color: var(--accent);
  margin-bottom: 20px;
  display: block;
}

.welcome-title {
  font-family: var(--font-serif);
  font-size: 40px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.welcome-author {
  font-size: 14px;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 28px;
}

.welcome-quote {
  font-family: var(--font-serif);
  font-size: 22px;
  font-style: italic;
  color: var(--accent);
  border-left: 3px solid var(--accent);
  padding: 10px 0 10px 22px;
  text-align: left;
  margin: 0 auto 28px;
  max-width: 380px;
}

.welcome-desc {
  font-size: 16px;
  color: var(--ink-light);
  line-height: 1.8;
  margin-bottom: 20px;
}

.welcome-hint {
  font-size: 13px;
  color: var(--ink-faint);
  font-style: italic;
}

/* ── Transitions ────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 700px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .content-panel {
    position: static;
    height: auto;
  }
}
</style>
