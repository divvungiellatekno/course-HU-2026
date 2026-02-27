<script setup lang="ts">
import { computed, onMounted } from 'vue'

const props = defineProps<{
  src: string
}>()

// Use new URL() pattern for proper asset handling by Vite
const audioSrc = computed(() => {
  // For files in public folder, prepend base URL
  const base = import.meta.env.BASE_URL
  const cleanSrc = props.src.startsWith('/') ? props.src.slice(1) : props.src
  const fullPath = `${base}${cleanSrc}`
  return fullPath
})

onMounted(() => {
  console.log('AudioPlayer mounted:', {
    originalSrc: props.src,
    baseUrl: import.meta.env.BASE_URL,
    resolvedSrc: audioSrc.value
  })
})
</script>

<template>
  <audio controls="controls">
    <source type="audio/wav" :src="audioSrc"/>
    <p>Your browser does not support the audio element.</p>
  </audio>
</template>
