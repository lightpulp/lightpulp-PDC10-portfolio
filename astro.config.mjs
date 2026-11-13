// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Change this to your deployed URL (e.g. https://yourname.pages.dev)
  site: 'https://pdc20-portfolio.example.com',
  markdown: {
    shikiConfig: { theme: 'vitesse-light', wrap: true },
  },
});
