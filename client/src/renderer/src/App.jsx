import React, { useState, useEffect } from 'react';
import Versions from './components/Versions';
import electronLogo from './assets/electron.svg';
import axios from "axios";


function App() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize IPC connection
  useEffect(() => {
    const handleIpcResponse = (event, message) => {
      console.log('IPC Response:', message);
    };

    window.electron.ipcRenderer.on('pong', handleIpcResponse);

    return () => {
      window.electron.ipcRenderer.removeListener('pong', handleIpcResponse);
    };
  }, []);

  const ipcHandle = () => {
    window.electron.ipcRenderer.send('ping');
  };

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      const response = await fetch(__API_URL__ + '/auth/check');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      setError(error.message);
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <img alt="logo" className="logo" src={electronLogo} />
        <div className="creator">Powered by electron-vite</div>
        <div className="text">
          Build an Electron app with <span className="react">React</span>
        </div>
      </header>

      <main className="main">
        <div className="status">
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}
          {apiData && (
            <div className="data">
              <h3>API Response</h3>
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="actions">
          <div className="action">
            <a 
              href="https://electron-vite.org/" 
              target="_blank" 
              rel="noreferrer"
              className="button"
            >
              Documentation
            </a>
          </div>
          
          <div className="action">
            <button 
              onClick={getData}
              disabled={loading}
              className="button"
            >
              Fetch Data
            </button>
          </div>

          <div className="action">
            <button 
              onClick={ipcHandle}
              className="button"
            >
              Send IPC
            </button>
          </div>
        </div>

        <div className="tip">
          <p>Press <code>F12</code> to open the devTools</p>
        </div>

        <Versions />
      </main>
    </div>
  );
}

export default App;