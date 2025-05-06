import { app, shell, BrowserWindow } from 'electron'
import path, { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'



function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })



  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  console.log('Loading file:', join(__dirname, "../renderer/index.html"));
  mainWindow.loadFile(join(__dirname, "../renderer/index.html")).catch((err) => {
    console.error('Failed to load index.html:', err);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//General client functionality starts here
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electron Chat App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="chat-app">
    <div id="contact-list"></div>
    <div id="chat-window"></div>
    <form id="message-form">
      <input type="text" id="message-input" placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
  </div>
  <script type="module" src="app.js"></script>
</body>
</html>

// style.css
body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  margin: 0;
  padding: 0;
}
#chat-app {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 20px auto;
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
}
#chat-window {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 5px;
}
#message-form {
  display: flex;
}
#message-input {
  flex: 1;
  padding: 5px;
}
button {
  padding: 5px 10px;
}

// app.js
import { setupSocket } from './socket.js';
import { renderMessage } from './components/chatWindow.js';
import { setupForm } from './components/messageForm.js';

const socket = setupSocket();
socket.on('chat message', renderMessage);

setupForm(socket);

// socket.js
import { io } from 'socket.io-client';

export function setupSocket() {
  const socket = io('http://localhost:3000');
  socket.on('connect', () => console.log('Connected to server'));
  return socket;
}

// components/chatWindow.js
export function renderMessage(msg) {
  const chatWindow = document.getElementById('chat-window');
  const msgElem = document.createElement('div');
  msgElem.textContent = msg;
  chatWindow.appendChild(msgElem);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// components/messageForm.js
export function setupForm(socket) {
  const form = document.getElementById('message-form');
  const input = document.getElementById('message-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });
}
