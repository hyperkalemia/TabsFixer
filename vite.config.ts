/* eslint @typescript-eslint/no-explicit-any: off */

import react from '@vitejs/plugin-react';
import { defineConfig, Rollup } from 'vite';

const entryNames = ["contentScripts", "popup", "background"] as const;
type entryNamesType = (typeof entryNames)[number];
function isEntryNamesType(item: any): item is entryNamesType {
	return entryNames.indexOf(item as entryNamesType) !== -1;
}

const ENTRY_NAME = process.env.ENTRY_NAME
const entryName: entryNamesType = isEntryNamesType(ENTRY_NAME) ? ENTRY_NAME : 'contentScripts'
const input_:{[key in entryNamesType]: string[]} = {
    contentScripts: ["./src/contentScripts/main.tsx"],
    popup: ["./src/popup/main.tsx"],
    background: ["./src/background.ts"]
}

// https://vitejs.dev/config/
export default defineConfig({
        base: './',
        publicDir: 'public',
        plugins: [react()],
        server: {
            open: './dev.html',
            host: true
        },
        build: {
            outDir: "./dist",
            emptyOutDir: entryName === "contentScripts",
            rollupOptions: {
                input: input_[entryName],
                output: {
                    entryFileNames: `js/${entryName}.js`,
                    chunkFileNames: `js/${entryName}.js`,
                    assetFileNames: (assetInfo: Rollup.PreRenderedAsset) => {
                        if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                            return `css/${entryName}[extname]`
                        }
                        return "assets/[name][extname]"
                    },
                },
            }
        }
    }
)