import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow Vercel sandbox hosts (e.g. sb-*.vercel.run) so dev server and HMR work in sandboxes
    allowedHosts: [".vercel.run"],
  },
});
