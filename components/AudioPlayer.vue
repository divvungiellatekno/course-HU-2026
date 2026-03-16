<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  src: string
}>()

const audioRef = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const errorMsg = ref('')

const audioSrc = computed(() => {
  const base = import.meta.env.BASE_URL
  const cleanSrc = props.src.startsWith('/') ? props.src.slice(1) : props.src
  return `${base}${cleanSrc}`
})

const togglePlay = async (e: Event) => {
  e.stopPropagation()
  e.preventDefault()
  
  if (!audioRef.value) return
  
  try {
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      await audioRef.value.play()
    }
  } catch (error) {
    console.error('Playback error:', error)
    errorMsg.value = `Error: ${error}`
  }
}

const handleTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

const handleLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px; background: #f0f0f0; padding: 10px; border-radius: 8px;">
    <button 
      @click="togglePlay"
      @mousedown.stop
      @mouseup.stop
      style="background: #42b883; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;"
    >
      {{ isPlaying ? '⏸' : '▶' }}
    </button>
    
    <div style="flex: 1; min-width: 0;">
      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
      <div style="font-size: 11px; color: #999;">
        {{ props.src.split('/').pop() }}
      </div>
    </div>
    
    <audio 
      ref="audioRef" 
      :src="audioSrc" 
      preload="metadata"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @error="errorMsg = 'Failed to load audio'"
      style="display: none;"
    />
    
    <p v-if="errorMsg" style="color: red; font-size: 12px; margin: 0;">{{ errorMsg }}</p>
  </div>
</template>
