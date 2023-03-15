
const { CracoAliasPlugin } = require('react-app-alias')
module.exports =  {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088/',
        changeOrigin: true,
        // pathRewrite: {
        // }
      }
    }
  },
  plugins: [
    {
      plugin: CracoAliasPlugin
    }
  ]
}