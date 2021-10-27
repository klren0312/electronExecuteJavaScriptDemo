module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: { preload: 'src/preload.js' },
      nodeIntegration: true // 渲染模式可以使用node
    }
  }
}