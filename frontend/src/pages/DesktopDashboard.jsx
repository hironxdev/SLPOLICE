import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function DesktopDashboard() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [liveLog, setLiveLog] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch System Info
    axios.get(`${API_URL}/api/system/info`)
      .then(res => setSystemInfo(res.data))
      .catch(err => console.error("Failed to fetch system info", err));

    // Initialize Socket
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnectionStatus('secured');
      addLog('Secure link established with backend.');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    // Handle terminal/live data (simulated for dashboard)
    newSocket.on('output', (data) => {
      // For the dashboard, we just show a snippet of live activity
      if (data.includes('Officer Secure Link')) {
         addLog(data);
      }
    });

    return () => newSocket.close();
  }, []);

  const addLog = (msg) => {
    setLiveLog(prev => [
      { id: Date.now(), time: new Date().toLocaleTimeString(), message: msg },
      ...prev.slice(0, 9) // Keep last 10
    ]);
  };

  return (
    <div className="desktop-dashboard">
      <div className="status-bar">
        <div className={`status-indicator ${connectionStatus}`}>
          <span className="dot"></span>
          {connectionStatus.toUpperCase()} LINK
        </div>
      </div>

      <div className="dashboard-grid">
        {/* System Info Panel */}
        <section className="dashboard-panel">
          <h3>System Information</h3>
          {systemInfo ? (
            <div className="info-list">
              <div className="info-item">
                <label>OS:</label> <span>{systemInfo.os}</span>
              </div>
              <div className="info-item">
                <label>Device Name:</label> <span>{systemInfo.deviceName}</span>
              </div>
              <div className="info-item">
                <label>Local IP:</label> <span>{systemInfo.ipAddress}</span>
              </div>
              <div className="info-item">
                <label>Platform:</label> <span>{systemInfo.platform}</span>
              </div>
              <div className="info-item">
                <label>Status:</label> <span style={{color: '#28a745'}}>Authorized</span>
              </div>
            </div>
          ) : <p>Retrieving system diagnostics...</p>}
        </section>

        {/* Live Updates Panel */}
        <section className="dashboard-panel">
          <h3>Live Security Feed</h3>
          <div className="log-viewer">
            {liveLog.length === 0 ? <p className="empty-log">Awaiting data...</p> : 
              liveLog.map(log => (
                <div key={log.id} className="log-entry">
                  <span className="log-time">[{log.time}]</span>
                  <span className="log-msg">{log.message}</span>
                </div>
              ))
            }
          </div>
        </section>
      </div>

      <style jsx>{`
        .desktop-dashboard {
          padding: 20px;
          color: #333;
        }
        .status-bar {
          margin-bottom: 20px;
          display: flex;
          justify-content: flex-end;
        }
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 4px 12px;
          border-radius: 12px;
          background: #f0f0f0;
        }
        .status-indicator.secured { color: #28a745; background: #e8f5e9; }
        .status-indicator.connecting { color: #856404; background: #fff3cd; }
        .status-indicator.disconnected { color: #dc3545; background: #f8d7da; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .dashboard-panel {
          background: #fff;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .dashboard-panel h3 {
          margin-top: 0;
          font-size: 1rem;
          border-bottom: 2px solid #004085;
          padding-bottom: 8px;
          color: #004085;
        }
        .info-list { display: flex; flex-direction: column; gap: 10px; }
        .info-item { display: flex; justify-content: space-between; font-size: 0.9rem; }
        .info-item label { color: #666; }
        .info-item span { font-weight: 600; }
        
        .log-viewer {
          background: #1e1e1e;
          color: #00ff00;
          font-family: 'Consolas', monospace;
          font-size: 0.8rem;
          padding: 10px;
          height: 200px;
          overflow-y: auto;
          border-radius: 4px;
        }
        .log-entry { margin-bottom: 4px; }
        .log-time { color: #888; margin-right: 8px; }
        .empty-log { color: #555; font-style: italic; }
      `}</style>
    </div>
  );
}

export default DesktopDashboard;
