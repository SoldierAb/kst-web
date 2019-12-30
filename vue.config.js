const path = require('path')

module.exports = {
  publicPath: '/',

  outputDir: 'dist',

  lintOnSave: true,

  chainWebpack: (config) => {
    config
      .output
      .filename(`js/[name].[hash:6].js`).end()
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@c': path.resolve(__dirname, './src/components'),
        '@v': path.resolve(__dirname, './src/views'),
        '@u': path.resolve(__dirname, './src/utils'),
        '@a': path.resolve(__dirname, './src/api'),
      }
    },
  },


  filenameHashing: false,

  css: {
    extract: false,

    sourceMap: false,
  
  },

  parallel: require('os').cpus().length > 1,

  devServer: {
    open: process.env.NODE_ENV === 'development',
    host: '0.0.0.0',
    port: 8090,
    https: false,
    hotOnly: true,
    proxy: {
      'api':{
        target:'http://192.168.120.60:8080',
        ws: true, // 是否启用websockets
        changOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRequiresRewrite: {
          "^api": "/"
        },
        // router:{
        //   'api/v1/outbounds':'http://192.168.120.60:8080',
        // }
      },
    
    },
    before: () => { },
    watchOptions: {
      poll: true,
      ignored: path.join(__dirname, '/node_modules')
    }
  },
}
