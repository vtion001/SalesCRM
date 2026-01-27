import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3001,
        host: '0.0.0.0',
        hmr: {
            clientPort: 3001
        }
      },
      plugins: [react()],
      define: {
        'process.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL || 'http://localhost:4000'),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
        'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY),
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
