import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const groqKey = env.VITE_GROQ_API_KEY || '';
  const encodedGroqKey = groqKey ? Buffer.from(groqKey).toString('base64') : '';

  return {
    plugins: [react()],
    base: '/',
    define: {
      __ENCODED_GROQ_KEY__: JSON.stringify(encodedGroqKey)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }
})
