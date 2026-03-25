import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In dev, we proxy `/api` calls from the Vite dev server (5173) to the backend.
// This prevents CORS issues and also fixes the common situation where the backend
// port isn't 5000 (e.g., when 5000 is already in use).
//
// You can change the target by creating `client/.env` with:
//   VITE_API_PROXY_TARGET=http://localhost:5000
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:5000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
