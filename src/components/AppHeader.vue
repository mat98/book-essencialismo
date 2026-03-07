<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="logo">
        <span class="logo-mark">◎</span>
        <div class="logo-text">
          <span class="logo-title">Essencialismo</span>
          <span class="logo-sub">Greg McKeown</span>
        </div>
      </div>

      <nav class="nav-actions">
        <button
          class="nav-btn"
          :class="{ active: showSearch }"
          @click="emit('toggle-search')"
          title="Buscar"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span>Buscar</span>
        </button>
      </nav>
    </div>

    <Transition name="search-bar">
      <div v-if="showSearch" class="search-bar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref="searchInput"
          v-model="localQuery"
          type="text"
          placeholder="Buscar capítulos, ideias, anotações..."
          @input="emit('search', localQuery)"
          @keyup.escape="emit('toggle-search')"
        />
        <button v-if="localQuery" class="clear-btn" @click="clearSearch">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  showSearch: Boolean,
  searchQuery: String,
})

const emit = defineEmits(['toggle-search', 'search'])

const searchInput = ref(null)
const localQuery = ref(props.searchQuery || '')

watch(
  () => props.showSearch,
  async (val) => {
    if (val) {
      await nextTick()
      searchInput.value?.focus()
    } else {
      localQuery.value = ''
    }
  }
)

function clearSearch() {
  localQuery.value = ''
  emit('search', '')
  searchInput.value?.focus()
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--cream);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 100%;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  font-size: 22px;
  color: var(--accent);
  line-height: 1;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.logo-title {
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.1;
  letter-spacing: 0.01em;
}

.logo-sub {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-soft);
  transition: background var(--transition), color var(--transition);
  cursor: pointer;
}

.nav-btn:hover {
  background: var(--cream-dark);
  color: var(--ink);
}

.nav-btn.active {
  background: var(--accent-bg);
  color: var(--accent);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.search-bar {
  padding: 0 24px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink-faint);
}

.search-bar input {
  flex: 1;
  background: var(--cream-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-size: 14px;
  color: var(--ink);
  outline: none;
  transition: border-color var(--transition);
  max-width: 480px;
}

.search-bar input:focus {
  border-color: var(--accent);
  background: white;
}

.search-bar input::placeholder {
  color: var(--ink-faint);
}

.clear-btn {
  color: var(--ink-faint);
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: color var(--transition);
  cursor: pointer;
}

.clear-btn:hover {
  color: var(--ink);
}

.search-bar-enter-active,
.search-bar-leave-active {
  transition: opacity 180ms ease, max-height 180ms ease;
  overflow: hidden;
  max-height: 50px;
}

.search-bar-enter-from,
.search-bar-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
