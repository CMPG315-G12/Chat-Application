import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig(({ command, mode }) => {

  // Debug environment loading
  console.log('Current working directory:', process.cwd());
  console.log('Current mode:', mode);

  // Load environment variables
  const env = loadEnv(mode, __dirname);
  console.log('Loaded environment variables:', env);

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      webPreferences: {
        webSecurity: false,
        allowRunningInsecureContent: true,
      },
      csp: {
        'default-src': ["'self'"],
        'connect-src': [
          "'self'",
          env.VITE_API_URL.replace(/\/$/, '') // Remove trailing slash
        ],
        'script-src': [
          "'self'",
          mode === 'development'
            ? "'unsafe-eval'"
            : null
        ].filter(Boolean),
        'style-src': [
          "'self'",
          mode === 'development'
            ? "'unsafe-inline'"
            : null
        ].filter(Boolean),
        'object-src': ["'none'"],
        'frame-src': ["'none'"],
        'worker-src': ["'self'", "blob:"],
        'child-src': ["'self'"],
        'img-src': ["'self'", "data:"],
        'font-src': ["'self'", "data:"],
        'media-src': ["'self'"],
        'manifest-src': ["'self'"]
      }
    },

    preload: {
      plugins: [externalizeDepsPlugin()],
      csp: {
        'default-src': ["'none'"],
        'script-src': ["'self'"],
        'connect-src': ["'self'"],
        'style-src': ["'self'"],
        'font-src': ["'self'"]
      }
    },

    renderer: {
      define: {
        __APP_NAME__: JSON.stringify(env.VITE_APP_NAME),
        __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
        __API_URL__: JSON.stringify(env.VITE_API_URL),
        __DEBUG__: env.DEBUG === 'true',
        __DEBUG_LEVEL__: JSON.stringify(env.VITE_DEBUG_LEVEL)
      },
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src')
        }
      },
      plugins: [react(), tailwindcss()],
      server: {
        historyApiFallback: true, // Ensures React Router works with Electron
      },
      csp: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          mode === 'development'
            ? "'unsafe-eval'"
            : null
        ].filter(Boolean),
        'style-src': [
          "'self'",
          mode === 'development'
            ? "'unsafe-inline'"
            : null
        ].filter(Boolean),
        'object-src': ["'none'"],
        'frame-src': ["'none'"],
        'worker-src': ["'self'", "blob:"],
        'child-src': ["'self'"],
        'img-src': ["'self'", "data:"],
        'font-src': ["'self'", "data:"],
        'media-src': ["'self'"],
        'manifest-src': ["'self'"],
        'connect-src': [
          "'self'",
          env.VITE_API_URL.replace(/\/$/, '')

        ]
      }
    }
  }
});