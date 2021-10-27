'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
import path from 'path'
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let win = null
let secondWin = null

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webviewTag: true
    }
  })

  console.log(process.env.WEBPACK_DEV_SERVER_URL)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

async function createSecondWindow() {
  // Create the browser window.
  secondWin = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // const ipc = require('electron').ipcRenderer

  secondWin.webContents.loadURL('https://www.baidu.com')
  secondWin.webContents.executeJavaScript(`
      const btn = document.createElement('button')
      btn.innerText = 'test'
      btn.style.position = 'absolute'
      btn.style.top = '20%'
      btn.style.left = '20%'
      btn.style.zIndex = '999999'
      document.body.appendChild(btn)
      btn.addEventListener('click', () => {
        window.ipcRenderer.send('test', 'test')
      })
    `, true)
      .then((result) => {
        console.log(result) // Will be the JSON object from the fetch call
      })
  secondWin.webContents.openDevTools()

}

// test
ipcMain.on('test', (e, v) => {
  console.log(v)
})

// open second window
ipcMain.on('openSecondWindow', () => {
  setTimeout(() => createSecondWindow(), 400)
})




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
app.on('ready', async () => {
  createWindow()
})
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
