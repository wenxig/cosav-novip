import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import react from '@vitejs/plugin-react'
import legacyPlugin from '@vitejs/plugin-legacy'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // legacyPlugin({
    //   targets: ['defaults', 'ie >= 11', 'chrome 52'],
    //   additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    //   renderLegacyChunks: true,
    //   renderModernChunks: false,
    // })
  ],
  experimental: {
    // enableNativePlugin: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('> 1%, last 2 versions, not ie <= 8')),
    },

  },
  base: "/",
  define: {
    process: "import.meta"
  }
})