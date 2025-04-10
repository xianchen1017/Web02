// vue.config.js
const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  publicPath: '/',
  transpileDependencies: true,

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~@': path.resolve(__dirname, 'src'),
        'views': path.resolve(__dirname, 'src/views')
      },
      extensions: ['.vue', '.ts', '.js', '.json'] // 注意.vue放在最前面
    }
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/variables.scss";`
      }
    }
  },

  chainWebpack: config => {
    // 添加对vue文件的处理
    config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')

    // TypeScript配置
    config.module
        .rule('ts')
        .test(/\.ts$/)
        .use('babel-loader')
        .loader('babel-loader')
        .end()
        .use('ts-loader')
        .loader('ts-loader')
        .options({
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
          happyPackMode: false // 禁用并行处理，避免某些奇怪问题
        })
  }
})