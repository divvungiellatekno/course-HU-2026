<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  src: string
}>()

const audioRef = ref<HTMLAudioElement>()
const errorMsg = ref('')

const audioSrc = computed(() => {
  const base = import.meta.env.BASE_URL
  const cleanSrc = props.src.startsWith('/') ? props.src.slice(1) : props.src
  return `${base}${cleanSrc}`
})

onMounted(() => {
  if (audioRef.value) {
    const audio = audioRef.value
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', audio.error)
      errorMsg.value = `Error: ${audio.error?.code} - ${audio.error?.message}`
    })
    
    audio.addEventListener('loadeddata', () => {
      console.log('Audio loaded successfully')
    })
    
    audio.addEventListener('play', () => {
      console.log('Audio play event fired')
    })
    
    audio.addEventListener('playing', () => {
      console.log('Audio is actually playing')
    })
  }
})
</script>

<template>
  <div @click.stop @mousedown.stop @mouseup.stop style="position: relative; z-index: 100; margin: 10px 0;">
    <audio 
      ref="audioRef" 
      controls 
      :src="audioSrc" 
      preload="metadata"
      @click.stop.prevent
      @mousedown.stop
      @mouseup.stop
      style="width: 100%; max-width: 400px; outline: 2px solid #42b883; border-radius: 4px;"
    >
      Your browser does not support the audio element.
    </audio>
    <p v-if="errorMsg" style="color: red; font-size: 12px;">{{ errorMsg }}</p>
  </div>
</template>
