import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    if (process.contextIsolated) {
      try {
        contextBridge.exposeInMainWorld('electron', {
          ...electronAPI,
          send: (channel, data) => ipcRenderer.send(channel, data),
          invoke: (channel, data) => ipcRenderer.invoke(channel, data),
          on: (channel, callback) => ipcRenderer.on(channel, callback),
          once: (channel, callback) => ipcRenderer.once(channel, callback),
          removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
        });
        contextBridge.exposeInMainWorld('api', api);
      } catch (error) {
        console.error(error);
      }
    } else {
      // fallback for non-context-isolated
      window.electron = {
        ...electronAPI,
        send: (channel, data) => ipcRenderer.send(channel, data),
        invoke: (channel, data) => ipcRenderer.invoke(channel, data),
        on: (channel, callback) => ipcRenderer.on(channel, callback),
        once: (channel, callback) => ipcRenderer.once(channel, callback),
        removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
      };
      window.api = api;
    }
  } catch (error) {
    console.error(error)
  }
}