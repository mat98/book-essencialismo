<template>
  <div class="star-rating" :class="[`size-${size}`, { readonly }]">
    <button
      v-for="n in 5"
      :key="n"
      class="star"
      :class="{ filled: n <= (hovered || modelValue), hovered: n <= hovered }"
      @mouseenter="!readonly && (hovered = n)"
      @mouseleave="!readonly && (hovered = 0)"
      @click="!readonly && emit('update:modelValue', n === modelValue ? 0 : n)"
      :disabled="readonly"
    >★</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: Boolean,
  size: { type: String, default: 'md' },
})

const emit = defineEmits(['update:modelValue'])
const hovered = ref(0)
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 2px;
}

.star {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--cream-darker);
  transition: color var(--transition), transform var(--transition);
  line-height: 1;
  padding: 0;
}

.star.filled {
  color: var(--accent);
}

.star.hovered {
  transform: scale(1.15);
}

.readonly .star {
  cursor: default;
}

.size-sm .star { font-size: 12px; }
.size-md .star { font-size: 18px; }
.size-lg .star { font-size: 24px; }
</style>
