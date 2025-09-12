import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'
// https://vitejs.dev/config/
const config=({mode})=>{
    return{
        plugins: [
            vue(),
            // 自动按需引入组件
            AutoImport({
                resolvers: [
                    ArcoResolver({
                        // importStyle: 'less',
                    }),
                ],
                imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
                eslintrc: {
                    enabled: true,
                },
            }),
            Components({
                directoryAsNamespace: true,
                resolvers: [
                    // 自动引入arco
                    ArcoResolver({
                        // importStyle: 'less',
                        resolveIcons: true,
                    }),
                ],
            }),
            UnoCSS(),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]',
            }),
        ],
        server: {
            host: '0.0.0.0', // 监听所有网络接口
            proxy: {
                '/appapi': {
                    target: 'https://testapp.realcopyright.cn', // 目标服务器
                    changeOrigin: true, // 必须设置为 true，用于支持跨域
                    rewrite: (path) => path.replace(/^\/appapi/, '/app'), // 路径重写
                },
            },

            port: 2583, // 指定端口号
            open: true
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
    }
}
export default defineConfig(config)
