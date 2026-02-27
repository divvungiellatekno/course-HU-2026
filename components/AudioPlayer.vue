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

const handleClick = (e: Event) => {
  // Stop event from propagating to Slidev
  e.stopPropagation()
}

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
  }
})
</script>

<template>
  <div @click.stop>
    <audio ref="audioRef" controls :src="audioSrc" preload="metadata" @click.stop>
      Your browser does not support the audio element.
    </audio>
    <p v-if="errorMsg" style="color: red; font-size: 12px;">{{ errorMsg }}</p>
  </div>
</template>
