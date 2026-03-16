<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  src: string
}>()

const audioRef = ref<HTMLAudioElement>()
const containerRef = ref<HTMLDivElement>()
const errorMsg = ref('')

const audioSrc = computed(() => {
  const base = import.meta.env.BASE_URL
  const cleanSrc = props.src.startsWith('/') ? props.src.slice(1) : props.src
  return `${base}${cleanSrc}`
})

onMounted(() => {
  // Remove Slidev v-click from parent elements
  if (containerRef.value) {
    let parent = containerRef.value.parentElement
    while (parent) {
      if (parent.classList.contains('slidev-vclick-target')) {
        parent.style.pointerEvents = 'none'
        console.log('Disabled pointer events on slidev-vclick-target')
      }
      parent = parent.parentElement
      if (parent?.id === 'slide-container') break
    }
    
    // Re-enable on our container
    if (containerRef.value) {
      containerRef.value.style.pointerEvents = 'auto'
    }
  }
  
  if (audioRef.value) {
    const audio = audioRef.value
    audio.style.pointerEvents = 'auto'
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', audio.error)
      errorMsg.value = `Error: ${audio.error?.code} - ${audio.error?.message}`
    })
    
    audio.addEventListener('loadeddata', () => {
      console.log('Audio loaded successfully')
    })
  }
})
</script>

<template>
  <div ref="containerRef" style="position: relative; z-index: 9999; margin: 10px 0; pointer-events: auto;">
    <audio 
      ref="audioRef" 
      controls 
      :src="audioSrc" 
      preload="metadata"
      style="width: 100%; max-width: 400px; pointer-events: auto;"
    >
      Your browser does not support the audio element.
    </audio>
    <p v-if="errorMsg" style="color: red; font-size: 12px;">{{ errorMsg }}</p>
  </div>
</template>
