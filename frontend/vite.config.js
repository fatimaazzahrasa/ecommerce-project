import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // 👈 ضروري نزيدو هادي باش تقاد المسارات

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // كيقرا ملفات الـ .env بحال اللي دار الـ AI
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      // كيدوز الـ Keys ديال الـ API إيلا احتاجهم الكود
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // 🚀 هادي هي السحرية اللي غاتهنيك من مشاكل الـ Imports ديال الـ AI كاملين!
        '@': path.resolve(process.cwd(), './src'), 
      },
    },
  }
})