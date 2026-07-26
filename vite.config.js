import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://franz.theavenir.dev",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
