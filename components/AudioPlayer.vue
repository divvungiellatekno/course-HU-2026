<script setup lang="ts">
const props = defineProps<{
  src: string
}>()

// Automatically adds base path for GitHub Pages
const audioSrc = import.meta.env.BASE_URL + props.src.replace(/^\//, '')
</script>

<template>
  <audio controls="controls">
    <source type="audio/wav" :src="audioSrc"/>
    <p>Your browser does not support the audio element.</p>
  </audio>
</template>
