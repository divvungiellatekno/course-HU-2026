<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  src: string
}>()

const audioRef = ref<HTMLAudioElement>()
const errorMsg = ref('')

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
  
  if (audioRef.value) {
    const audio = audioRef.value
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error event:', e, audio.error)
      errorMsg.value = `Error: ${audio.error?.message || 'Unknown error'}`
    })
    
    audio.addEventListener('loadeddata', () => {
      console.log('Audio loaded successfully:', audioSrc.value)
    })
    
    audio.addEventListener('play', () => {
      console.log('Play event triggered')
    })
    
    audio.addEventListener('playing', () => {
      console.log('Audio is playing')
    })
    
    audio.addEventListener('pause', () => {
      console.log('Audio paused')
    })
    
    audio.addEventListener('ended', () => {
      console.log('Audio ended')
    })
    
    audio.addEventListener('stalled', () => {
      console.warn('Audio stalled')
    })
    
    audio.addEventListener('suspend', () => {
      console.log('Audio suspend (normal for lazy loading)')
    })
  }
})
</script>

<template>
  <div>
    <audio ref="audioRef" controls="controls" preload="metadata">
      <source type="audio/wav" :src="audioSrc"/>
      <p>Your browser does not support the audio element.</p>
    </audio>
    <p v-if="errorMsg" style="color: red; font-size: 12px;">{{ errorMsg }}</p>
  </div>
</template>
