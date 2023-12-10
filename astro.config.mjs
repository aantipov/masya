import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    routes: {
      strategy: 'include',
      include: ['/api/*'], // handled by custom function: functions/api/id].js
    },
  }),
  integrations: [tailwind()],
});
