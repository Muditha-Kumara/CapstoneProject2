import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./certs/192.168.1.103-key.pem'),
      cert: fs.readFileSync('./certs/192.168.1.103.pem'),
    },
    host: '192.168.1.103',
    port: 3000,
  },
});
