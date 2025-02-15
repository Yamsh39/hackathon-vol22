import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 8080,
  },
  preview: {
    allowedHosts: [
      "hackathon-vol22-frontend-812851936222.asia-northeast1.run.app",
      ".run.app" // 他の Cloud Run ホストも許可
    ],
  },
  plugins: [react()]
});
