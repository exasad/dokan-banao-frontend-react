import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ react(),],
  optimizeDeps: {
    include: ['react-big-calendar'], // forces pre-bundling
  },
  define: {
    "process.env": {},
  },
  server: {
    hmr: {
      overlay: false,
      
    },
  },
  resolve: {
    alias: [
      {
        find: "@crema",
        replacement: fileURLToPath(new URL("./src/@crema", import.meta.url)),
      },
    ],
  },
});
