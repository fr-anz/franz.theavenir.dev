import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      // Keep local guestbook submissions away from production. Run the Vercel
      // Functions locally on port 3000 when you want to test Neon end to end.
      "/api/guestbook": {
        target:
          process.env.VITE_GUESTBOOK_API_TARGET || "http://localhost:3000",
        changeOrigin: true,
        secure: true,
      },
      "/api": {
        target: "https://franz.theavenir.dev",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
