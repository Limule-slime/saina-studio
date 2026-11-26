import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://saina-studio.com',
  trailingSlash: 'always',
  integrations: [react()],
});
