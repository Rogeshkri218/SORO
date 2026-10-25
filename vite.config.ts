import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { createEnquiryHandler } from './api/enquiry.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const enquiryApiPlugin = (environment: Record<string, string | undefined>): Plugin => ({
  name: 'soro-enquiry-api',
  configureServer(server) {
    const handler = createEnquiryHandler(environment)
    server.middlewares.use('/api/enquiry', (request, response) => {
      void handler(request, response)
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const localEnvironment = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      enquiryApiPlugin({
        RESEND_API_KEY: localEnvironment.RESEND_API_KEY,
        ENQUIRY_FROM_EMAIL: localEnvironment.ENQUIRY_FROM_EMAIL,
        ENQUIRY_ALLOWED_ORIGINS: localEnvironment.ENQUIRY_ALLOWED_ORIGINS,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three'
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        },
      },
    },
  }
})
