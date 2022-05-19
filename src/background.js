'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain
} from 'electron'
import {
  createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
import path from 'path'

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])


let win = null
let secondWin = null

async function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

async function createSecondWindow() {
  secondWin = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  secondWin.webContents.loadURL('https://www.baidu.com')
  // add the button, and add click event to ipc
  // secondWin.webContents.executeJavaScript(`
  //     const btn = document.createElement('button')
  //     btn.innerText = 'test'
  //     btn.style.position = 'absolute'
  //     btn.style.top = '20px'
  //     btn.style.left = '20px'
  //     btn.style.zIndex = '999999'
  //     document.body.appendChild(btn)
  //     btn.addEventListener('click', () => {
  //       window.ipcRenderer.send('test', 'test')
  //     })

  //     const domMap = new Map()
  //     document.body.addEventListener('click', function (event) {
  //       const element = event.target
  //       console.log('chrome', cssPath(element, true))
  //       element.classList.add('active')
  //       domMap.set(cssPath(element, true), element.innerText)
  //     })

  //     document.body.addEventListener('mousemove', function (event) {
  //       const element = event.target
  //     }, {
  //       capture: true
  //     })

  //     document.body.addEventListener('mouseleave', function (event) {
  //       const element = event.target
  //     }, {
  //       capture: true
  //     })

  //     class Step {
  //       constructor(value, optimized) {
  //         this.value = value
  //         this.optimized = optimized || false
  //       }

  //       toString() {
  //         return this.value
  //       }
  //     }
  //     const cssPath = function(node, optimized) {
  //       if (node.nodeType !== Node.ELEMENT_NODE) {
  //         return ''
  //       }

  //       const steps = []
  //       let contextNode = node
  //       while (contextNode) {
  //         const step = cssPathStep(contextNode, Boolean(optimized), contextNode === node)
  //         if (!step) {
  //           break
  //         }  // Error - bail out early.
  //         steps.push(step)
  //         if (step.optimized) {
  //           break
  //         }
  //         contextNode = contextNode.parentNode
  //       }

  //       steps.reverse()
  //       return steps.join(' > ')
  //     }
  //     const cssPathStep = function (node, optimized, isTargetNode) {
  //       if (node.nodeType !== Node.ELEMENT_NODE) {
  //         return null
  //       }

  //       const id = node.getAttribute('id')
  //       if (optimized) {
  //         if (id) {
  //           return new Step(idSelector(id), true)
  //         }
  //         const nodeNameLower = node.nodeName.toLowerCase()
  //         if (nodeNameLower === 'body' || nodeNameLower === 'head' || nodeNameLower === 'html') {
  //           return new Step(nodeNameInCorrectCase(node), true)
  //         }
  //       }
  //       const nodeName = nodeNameInCorrectCase(node)

  //       if (id) {
  //         return new Step(nodeName + idSelector(id), true)
  //       }
  //       const parent = node.parentNode
  //       if (!parent || parent.nodeType === Node.DOCUMENT_NODE) {
  //         return new Step(nodeName, true)
  //       }

  //       function prefixedElementClassNames(node) {
  //         const classAttribute = node.getAttribute('class')
  //         if (!classAttribute) {
  //           return []
  //         }

  //         return classAttribute.split(/\s+/g).filter(Boolean).map(function (name) {
  //           // The prefix is required to store "__proto__" in a object-based map.
  //           return '$' + name
  //         })
  //       }

  //       function idSelector(id) {
  //         return '#' + CSS.escape(id)
  //       }

  //       const prefixedOwnClassNamesArray = prefixedElementClassNames(node)
  //       let needsClassNames = false
  //       let needsNthChild = false
  //       let ownIndex = -1
  //       let elementIndex = -1
  //       const siblings = parent.children
  //       for (let i = 0; siblings && (ownIndex === -1 || !needsNthChild) && i < siblings.length; ++i) {
  //         const sibling = siblings[i]
  //         if (sibling.nodeType !== Node.ELEMENT_NODE) {
  //           continue
  //         }
  //         elementIndex += 1
  //         if (sibling === node) {
  //           ownIndex = elementIndex
  //           continue
  //         }
  //         if (needsNthChild) {
  //           continue
  //         }
  //         if (nodeNameInCorrectCase(sibling) !== nodeName) {
  //           continue
  //         }

  //         needsClassNames = true
  //         const ownClassNames = new Set(prefixedOwnClassNamesArray)
  //         if (!ownClassNames.size) {
  //           needsNthChild = true
  //           continue
  //         }
  //         const siblingClassNamesArray = prefixedElementClassNames(sibling)
  //         for (let j = 0; j < siblingClassNamesArray.length; ++j) {
  //           const siblingClass = siblingClassNamesArray[j]
  //           if (!ownClassNames.has(siblingClass)) {
  //             continue
  //           }
  //           ownClassNames.delete(siblingClass)
  //           if (!ownClassNames.size) {
  //             needsNthChild = true
  //             break
  //           }
  //         }
  //       }

  //       let result = nodeName
  //       if (isTargetNode && nodeName.toLowerCase() === 'input' && node.getAttribute('type') && !node.getAttribute('id') &&
  //         !node.getAttribute('class')) {
  //         result += '[type=' + CSS.escape((node.getAttribute('type')) || '') + ']'
  //       }
  //       if (needsNthChild) {
  //         result += ':nth-child(' + (ownIndex + 1) + ')'
  //       } else if (needsClassNames) {
  //         for (const prefixedName of prefixedOwnClassNamesArray) {
  //           result += '.' + CSS.escape(prefixedName.slice(1))
  //         }
  //       }

  //       return new Step(result, false)
  //     }

  //     function nodeNameInCorrectCase(node) {
  //       const shadowRootType = node.shadowRootType
  //       if (shadowRootType) {
  //         return '#shadow-root (' + shadowRootType + ')'
  //       }

  //       // If there is no local #name, it's case sensitive
  //       if (!node.localName) {
  //         return node.nodeName
  //       }

  //       // If the names are different lengths, there is a prefix and it's case sensitive
  //       if (node.localName.length !== node.nodeName.length) {
  //         return node.nodeName
  //       }

  //       // Return the localname, which will be case insensitive if its an html node
  //       return node.localName
  //     }
  //   `, true)
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