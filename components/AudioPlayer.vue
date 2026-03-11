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

const testClick = (e: MouseEvent) => {
  console.log('🖱️ Container clicked!', e.target)
  
  // Find what element is at the click position
  const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY)
  console.log('Elements at click point:', elementsAtPoint.map(el => ({
    tag: el.tagName,
    class: el.className,
    id: el.id,
    zIndex: window.getComputedStyle(el).zIndex,
    pointerEvents: window.getComputedStyle(el).pointerEvents
  })))
  
  // Try to play programmatically
  if (audioRef.value) {
    console.log('Attempting to play audio programmatically...')
    audioRef.value.play().then(() => {
      console.log('✅ Play succeeded!')
    }).catch(err => {
      console.error('❌ Play failed:', err)
    })
  }
}

onMounted(() => {
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
    
    audio.addEventListener('play', () => {
      console.log('🎵 Audio play event fired!')
    })
    
    audio.addEventListener('playing', () => {
      console.log('🎵 Audio is actually playing!')
    })
    
    audio.addEventListener('click', (e) => {
      console.log('🖱️ Audio element clicked!')
      e.stopPropagation()
    })
  }
})
</script>

<template>
  <div 
    ref="containerRef"
    @click="testClick"
    style="position: relative; z-index: 9999; margin: 10px 0; pointer-events: auto; background: rgba(66, 184, 131, 0.1); padding: 10px; border: 2px solid #42b883;"
  >
    <p style="font-size: 12px; margin-bottom: 5px; color: #42b883;">🔍 Click anywhere in this green box</p>
    <audio 
      ref="audioRef" 
      controls 
      :src="audioSrc" 
      preload="metadata"
      style="width: 100%; max-width: 400px; pointer-events: auto; position: relative; z-index: 10000;"
    >
      Your browser does not support the audio element.
    </audio>
    <p v-if="errorMsg" style="color: red; font-size: 12px;">{{ errorMsg }}</p>
  </div>
</template>
