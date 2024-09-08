import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'; // 引入 path 模块

export default defineConfig({
	base: './',
	plugins: [
		vue(),
		VueSetupExtend(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
			}),
		Components({
			resolvers: [ElementPlusResolver()]
			})
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, 'src') // 设置 @ 别名指向 src 目录
		}
	},
	optimizeDeps: {
		include: ['schart.js']
	},
	server: {
		host: "0.0.0.0",
		proxy: {
			"/api": {
				target: "https://sockettest.skylinedances.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
