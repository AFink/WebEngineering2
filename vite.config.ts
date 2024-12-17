import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa";
import mkcert from 'vite-plugin-mkcert'

const manifestForPlugin = {
    registerType: 'autoUpdate' as const,
    devOptions: {
        enabled: true
    },
    injectRegister: "inline" as const,
    // add this to cache all the imports
    workbox: {
        globPatterns: ["**/*"],
    },
    // add this to cache all the
    // static assets in the public folder
    includeAssets: [
        "**/*",
    ],
    injectManifest: {
        minify: false,
        enableWorkboxModulesLogs: true as const,
    },
    srcDir: 'src',
    filename: 'sw.ts',
    strategies: 'injectManifest' as const,
    manifest: {
        name: 'Navigation PWA',
        short_name: 'Navigation PWA',
        theme_color: '#ffffff',
        icons: [
            {
                src: 'pwa-192x192.png', // <== don't add slash, for testing
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/pwa-512x512.png', // <== don't remove slash, for testing
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: 'pwa-512x512.png', // <== don't add slash, for testing
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
    },
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA(manifestForPlugin), mkcert()],
})
