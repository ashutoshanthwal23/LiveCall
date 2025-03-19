import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // Allows access from external devices & networks
    port: 5173, // Keep a fixed port
    strictPort: true, // Ensures Vite does not switch ports
    cors: true, // Enables CORS for all domains
    hmr: {
      clientPort: 443, // Required for Ngrok to work properly
    },
    headers: {
      "Access-Control-Allow-Origin": "*", // Allows requests from any origin
    },
    allowedHosts: [
      "2a09-2402-3a80-10d-a5d3-719c-6d01-6386-51e.ngrok-free.app", // Add your ngrok URL
      ".ngrok-free.app" // Allows all ngrok subdomains
    ],
  },

})
