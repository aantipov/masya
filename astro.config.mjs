import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  site: 'https://masya.dev',
  output: 'server',
  adapter: cloudflare({
    runtime: {
      mode: 'local',
      type: 'pages',
      bindings: {},
    },
    mode: 'directory',
    routes: {
      strategy: 'include',
      include: ['/api/*'], // handled by custom function: functions/api/id].js
    },
  }),
  integrations: [tailwind(), solidJs()],
});
