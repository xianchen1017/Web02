import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 加载环境变量（关键修改）
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            vue(),
            createSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), 'src/icons')],
                symbolId: 'icon-[dir]-[name]'
            })
        ],
        // 新增配置
        define: {
            'process.env': env // 将环境变量注入到客户端
        },
        // 新增服务器代理配置（开发环境）
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL || 'http://localhost:8080',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },
        // 解决路径别名问题（可选）
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        }
    }
})