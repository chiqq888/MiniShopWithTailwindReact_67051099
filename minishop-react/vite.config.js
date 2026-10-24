import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    // JSON Server ดูแล db.json เอง ไม่ต้องให้ Vite รีโหลดหน้าเมื่อทำ CRUD
    watch: { ignored: ['**/db.json'] },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
