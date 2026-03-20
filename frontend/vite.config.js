import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    // NOTE: Proxy removed — api.js uses a full base URL (http://127.0.0.1:5000)
    // so requests go directly to Flask. Flask-CORS handles the cross-origin headers.
    // To switch to proxy-based routing, uncomment below and set BASE_URL = "" in api.js:
    //
    // proxy: {
    //   "/api": {
    //     target: "http://127.0.0.1:5000",
    //     changeOrigin: true,
    //   },
    // },
  },
});
