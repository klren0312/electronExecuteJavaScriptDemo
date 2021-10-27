const { ipcRenderer } = require('electron')
ipcRenderer.on('ping', () => {
  ipcRenderer.sendToHost('pong')
})

const script = document.createElement('script')
    script.src = 'https://cdn.bootcdn.net/ajax/libs/eruda/2.4.1/eruda.min.js'
    document.head.appendChild(script)
    setTimeout(() => {
      const script2 = document.createElement('script')
      script2.innerText = 'eruda.init()'
      document.head.appendChild(script2)
    }, 3000)
const btn = document.createElement('button')
btn.innerText = 'TEST'
btn.style.position = 'absolute'
btn.style.top = '20%'
btn.style.left = '20%'
btn.style.background = '#ff0000'
document.body.appendChild(btn)