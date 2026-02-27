import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: 'public',
  build: {
    copyPublicDir: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep WAV files in root
          if (assetInfo.name && assetInfo.name.endsWith('.wav')) {
            return '[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
