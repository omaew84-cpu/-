import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Eye,
  XCircle,
  Settings,
  Power,
  Activity,
  Key,
  Cpu,
  ShieldAlert,
  RefreshCw,
  BarChart2,
  Wifi,
  WifiOff,
  Globe,
  Trash2,
  Copy,
  Check,
  Plus,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Database,
  Smartphone
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isBlockingEnabled, setIsBlockingEnabled] = useState(true);
  const [blockedCount, setBlockedCount] = useState(142);
  const [systemLogs, setSystemLogs] = useState(['SYSTEM INITIALIZED...']);

  // VPN State
  const [vpnEnabled, setVpnEnabled] = useState(false);
  const [vpnServer, setVpnServer] = useState('US-NYC');
  const vpnServers = [
    { id: 'US-NYC', name: '🇺🇸 New York', ping: 45, country: 'United States' },
    { id: 'JP-TYO', name: '🇯🇵 Tokyo', ping: 12, country: 'Japan' },
    { id: 'DE-FRA', name: '🇩🇪 Frankfurt', ping: 89, country: 'Germany' },
    { id: 'SG-SIN', name: '🇸🇬 Singapore', ping: 28, country: 'Singapore' },
    { id: 'GB-LON', name: '🇬🇧 London', ping: 65, country: 'United Kingdom' }
  ];

  // Password Manager State
  const [passwordList, setPasswordList] = useState([
    { id: 1, name: 'Gmail', username: 'user@gmail.com', strength: 'STRONG', lastChanged: '2 days ago' },
    { id: 2, name: 'GitHub', username: 'developer', strength: 'STRONG', lastChanged: '1 week ago' },
    { id: 3, name: 'Twitter', username: 'username', strength: 'WEAK', lastChanged: '3 months ago' }
  ]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState({ name: '', username: '' });

  // Data Cleanup State
  const [cacheSize, setCacheSize] = useState('2.3 GB');
  const [tempFiles, setTempFiles] = useState('450 MB');
  const [cookies, setCookies] = useState('156 cookies');
  const [cleaning, setCleaning] = useState(false);

  // Network Monitor State
  const [networkData, setNetworkData] = useState({
    upload: 0,
    download: 0,
    activeConnections: 3,
    totalRequests: 1247
  });

  // VPN Connection Log
  const [vpnLog, setVpnLog] = useState([
    { time: '14:32:15', server: 'US-NYC', status: 'Connected', ip: '192.168.1.1' },
    { time: '14:15:42', server: 'JP-TYO', status: 'Disconnected', ip: '10.0.0.1' }
  ]);

  // Cookie Manager State
  const [cookies_data, setCookies_data] = useState([
    { id: 1, site: 'google.com', type: 'Tracking', size: '45 KB', expires: '2026-05-30' },
    { id: 2, site: 'facebook.com', type: 'Functional', size: '78 KB', expires: '2026-06-15' },
    { id: 3, site: 'twitter.com', type: 'Analytics', size: '32 KB', expires: '2026-05-25' }
  ]);

  const appsData = [
    { name: 'Social Media', status: 'CRITICAL' },
    { name: 'Financial App', status: 'PROTECTED' },
    { name: 'Weather Tool', status: 'SAFE' }
  ];

  // Permission Scanner
  const permissionProfiles = {
    'Social Media': ['CAMERA', 'MIC', 'LOCATION', 'CONTACTS', 'NETWORK'],
    'Financial App': ['NETWORK', 'STORAGE'],
    'Weather Tool': ['LOCATION', 'NETWORK']
  };

  const [scanResults, setScanResults] = useState([]);

  const calculatePermissionRisk = (permissions) => {
    let score = 0;
    const riskMap = {
      CAMERA: 30,
      MIC: 25,
      LOCATION: 20,
      CONTACTS: 25,
      NETWORK: 10,
      STORAGE: 10
    };
    permissions.forEach((p) => {
      score += riskMap[p] || 0;
    });
    return Math.min(score, 100);
  };

  const runPermissionScan = () => {
    const results = appsData.map((app) => {
      const perms = permissionProfiles[app.name] || [];
      return {
        app: app.name,
        permissions: perms,
        risk: calculatePermissionRisk(perms)
      };
    });
    setScanResults(results);
  };

  // Malware Detector
  const malwareSignals = {
    'Social Media': ['NETWORK_SPIKE', 'BACKGROUND_MIC', 'LOCATION_PING'],
    'Financial App': ['SECURE_CHANNEL', 'HASH_CHECK'],
    'Weather Tool': ['LOCATION_PING']
  };

  const [malwareResults, setMalwareResults] = useState([]);

  const calculateMalwareRisk = (signals) => {
    let score = 0;
    const riskMap = {
      NETWORK_SPIKE: 30,
      BACKGROUND_MIC: 40,
      LOCATION_PING: 20,
      STORAGE_WRITE: 25,
      OBFUSCATED_CODE: 35,
      SECURE_CHANNEL: -10,
      HASH_CHECK: -15
    };
    signals.forEach((s) => {
      score += riskMap[s] || 0;
    });
    return Math.min(Math.max(score, 0), 100);
  };

  const runMalwareScan = () => {
    const results = appsData.map((app) => {
      const signals = malwareSignals[app.name] || [];
      return {
        app: app.name,
        signals,
        risk: calculateMalwareRisk(signals)
      };
    });
    setMalwareResults(results);
  };

  // AI Threat Score
  const [aiThreatScore, setAiThreatScore] = useState(null);

  const computeAIThreatScore = () => {
    if (scanResults.length === 0 || malwareResults.length === 0) {
      alert('กรุณารัน Permission Scanner และ Malware Detector ก่อน');
      return;
    }

    const permissionRisk =
      scanResults.reduce((sum, r) => sum + r.risk, 0) / scanResults.length;

    const malwareRisk =
      malwareResults.reduce((sum, r) => sum + r.risk, 0) / malwareResults.length;

    const blockerRisk = Math.min(blockedCount / 10, 100);

    const score =
      permissionRisk * 0.35 +
      malwareRisk * 0.45 +
      blockerRisk * 0.20;

    setAiThreatScore(Math.round(score));
  };

  const getThreatLevel = (score) => {
    if (score > 80) return 'วิกฤต';
    if (score > 60) return 'สูง';
    if (score > 30) return 'ปานกลาง';
    return 'ปลอดภัย';
  };

  const getThreatColor = (score) => {
    if (score > 80) return 'bg-red-500';
    if (score > 60) return 'bg-yellow-500';
    if (score > 30) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Firewall
  const [firewallRules] = useState([
    { id: 1, pattern: 'api.social.com', action: 'BLOCK' },
    { id: 2, pattern: 'ads.tracker.net', action: 'BLOCK' },
    { id: 3, pattern: 'secure.bank.com', action: 'ALLOW' },
    { id: 4, pattern: 'weather.api.com', action: 'ALLOW' }
  ]);

  const [firewallStats, setFirewallStats] = useState({ allowed: 0, blocked: 0 });
  const [firewallLog, setFirewallLog] = useState([]);

  const liveTrafficSamples = [
    { host: 'api.social.com', app: 'Social Media' },
    { host: 'cdn.images.com', app: 'Social Media' },
    { host: 'secure.bank.com', app: 'Financial App' },
    { host: 'ads.tracker.net', app: 'Social Media' },
    { host: 'weather.api.com', app: 'Weather Tool' }
  ];

  const runFirewallEngine = () => {
    let allowed = 0;
    let blocked = 0;
    const log = [];

    liveTrafficSamples.forEach((packet) => {
      const rule = firewallRules.find((r) => packet.host.includes(r.pattern));
      let action = 'ALLOW';

      if (rule) {
        action = rule.action;
      }

      if (action === 'BLOCK') blocked++;
      else allowed++;

      log.unshift({
        time: new Date().toLocaleTimeString(),
        app: packet.app,
        host: packet.host,
        action
      });
    });

    setFirewallStats({ allowed, blocked });
    setFirewallLog(log.slice(0, 30));
  };

  // Blocker engine logs
  useEffect(() => {
    if (!isBlockingEnabled) return;
    const interval = setInterval(() => {
      setBlockedCount((prev) => prev + Math.floor(Math.random() * 3));
      setSystemLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] BLOCKED TRACKER ATTEMPT`,
        ...prev.slice(0, 4)
      ]);
      setNetworkData((prev) => ({
        ...prev,
        download: Math.max(0, prev.download + (Math.random() - 0.3) * 100),
        upload: Math.max(0, prev.upload + (Math.random() - 0.4) * 50)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isBlockingEnabled]);

  // VPN Connection Toggle
  const handleVpnToggle = () => {
    if (!vpnEnabled) {
      const timestamp = new Date().toLocaleTimeString();
      setVpnLog((prev) => [
        { time: timestamp, server: vpnServer, status: 'Connected', ip: generateRandomIP() },
        ...prev.slice(0, 4)
      ]);
    }
    setVpnEnabled(!vpnEnabled);
  };

  // Add Password
  const handleAddPassword = () => {
    if (newPassword.name && newPassword.username) {
      setPasswordList([
        ...passwordList,
        {
          id: Date.now(),
          name: newPassword.name,
          username: newPassword.username,
          strength: 'STRONG',
          lastChanged: 'just now'
        }
      ]);
      setNewPassword({ name: '', username: '' });
      setShowPasswordForm(false);
    }
  };

  // Delete Password
  const handleDeletePassword = (id) => {
    setPasswordList(passwordList.filter((p) => p.id !== id));
  };

  // Clean Cache
  const handleCleanCache = () => {
    setCleaning(true);
    setTimeout(() => {
      setCacheSize('0 MB');
      setTempFiles('0 MB');
      setCookies('0 cookies');
      setCleaning(false);
    }, 2000);
  };

  // Delete Cookie
  const handleDeleteCookie = (id) => {
    setCookies_data(cookies_data.filter((c) => c.id !== id));
  };

  // Generate random IP for simulation
  const generateRandomIP = () => {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  };

  // Copy to clipboard utility
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="relative bg-slate-900 border border-slate-700 p-8 rounded-3xl text-white shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]">
              <h2 className="text-sm uppercase tracking-widest text-blue-400 mb-2">
                System Status
              </h2>
              <div className="flex items-end gap-2 mb-4">
                <Shield className="text-blue-500" size={40} />
                <span className="text-4xl font-black italic tracking-tighter">
                  85% SECURE
                </span>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <div>
                  <p className="text-slate-400">Blocked Today</p>
                  <p className="text-green-400 font-bold">{blockedCount}</p>
                </div>
                <div>
                  <p className="text-slate-400">VPN Status</p>
                  <p className={`font-bold ${vpnEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    {vpnEnabled ? 'ACTIVE' : 'INACTIVE'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl shadow-lg">
              <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
                <Activity size={18} className="text-blue-500" /> REAL-TIME LOGS
              </h3>
              <div className="font-mono text-[10px] text-blue-400 space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                {systemLogs.map((log, i) => (
                  <p key={i}>{log}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-mono mb-1">DOWNLOAD</p>
                <p className="text-2xl font-bold text-blue-400">{networkData.download.toFixed(1)} KB/s</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-mono mb-1">UPLOAD</p>
                <p className="text-2xl font-bold text-yellow-400">{networkData.upload.toFixed(1)} KB/s</p>
              </div>
            </div>
          </div>
        );

      case 'blocker':
        return (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white">BLOCKER ENGINE</h3>
                <p className="text-xs text-blue-400 font-mono">
                  {isBlockingEnabled ? 'ACTIVE / LIVE' : 'OFFLINE'}
                </p>
              </div>
              <button
                onClick={() => setIsBlockingEnabled(!isBlockingEnabled)}
                className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${
                  isBlockingEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-700'
                }`}
              >
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </button>
            </div>
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl">
              <div className="flex justify-between mb-4">
                <span className="text-slate-400">Total Blocked:</span>
                <span className="text-white font-bold">{blockedCount}</span>
              </div>
              {['AD_NETWORK', 'TRACKING_PIXEL', 'LOCATION_LOG'].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between py-3 border-b border-slate-800"
                >
                  <span className="text-slate-400 font-mono text-sm">{item}</span>
                  <span className="text-xs text-red-500 font-bold animate-pulse">
                    LIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'encrypt':
        return (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                <Key className="text-blue-500" /> ENCRYPTION CORE
              </h2>
              <textarea
                className="w-full h-32 p-4 bg-slate-950 border border-slate-700 rounded-2xl text-blue-400 font-mono text-sm focus:outline-none"
                placeholder="Input payload..."
              ></textarea>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="bg-blue-600 text-white py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  ENCRYPT
                </button>
                <button className="bg-slate-800 text-slate-300 py-3 rounded-xl font-bold border border-slate-700">
                  DECRYPT
                </button>
              </div>
            </div>
          </div>
        );

      case 'vpn':
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2 mb-4">
              <Wifi className="text-green-500" size={18} /> VPN CONNECTION
            </h2>

            <div className={`bg-slate-900 border p-6 rounded-3xl flex justify-between items-center ${vpnEnabled ? 'border-green-700' : 'border-slate-700'}`}>
              <div>
                <h3 className="font-bold text-white">{vpnEnabled ? 'CONNECTED' : 'DISCONNECTED'}</h3>
                <p className={`text-xs font-mono ${vpnEnabled ? 'text-green-400' : 'text-slate-500'}`}>
                  {vpnEnabled ? `Server: ${vpnServer}` : 'No active connection'}
                </p>
              </div>
              <button
                onClick={handleVpnToggle}
                className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${
                  vpnEnabled ? 'bg-green-600 justify-end' : 'bg-slate-700'
                }`}
              >
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl">
              <p className="text-xs text-slate-400 mb-3 font-mono">AVAILABLE SERVERS</p>
              <div className="space-y-2">
                {vpnServers.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => setVpnServer(server.id)}
                    className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${
                      vpnServer === server.id
                        ? 'border-blue-600 bg-blue-900/20'
                        : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-white text-sm font-bold">{server.name}</p>
                      <p className="text-xs text-slate-500">{server.country}</p>
                    </div>
                    <span className={`text-xs font-mono ${
                      server.ping < 50 ? 'text-green-400' : server.ping < 150 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {server.ping}ms
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl">
              <p className="text-xs text-slate-400 mb-3 font-mono">CONNECTION LOG</p>
              <div className="space-y-2 max-h-40 overflow-y-auto text-[10px] font-mono">
                {vpnLog.map((entry, i) => (
                  <div key={i} className="flex justify-between px-2 py-1.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500">{entry.time}</span>
                    <span className="text-slate-300">{entry.server}</span>
                    <span className={entry.status === 'Connected' ? 'text-green-400' : 'text-red-400'}>
                      {entry.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'passwords':
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2 mb-4">
              <Lock className="text-blue-500" size={18} /> PASSWORD MANAGER
            </h2>

            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <Plus size={16} /> Add Password
            </button>

            {showPasswordForm && (
              <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-3">
                <input
                  type="text"
                  placeholder="Service name..."
                  value={newPassword.name}
                  onChange={(e) => setNewPassword({ ...newPassword, name: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  placeholder="Username..."
                  value={newPassword.username}
                  onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-blue-600"
                />
                <button
                  onClick={handleAddPassword}
                  className="w-full bg-green-600 text-white py-2 rounded-xl font-bold"
                >
                  Save
                </button>
              </div>
            )}

            <div className="space-y-3">
              {passwordList.map((pwd) => (
                <div key={pwd.id} className="bg-slate-900 border border-slate-700 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-bold">{pwd.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{pwd.username}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePassword(pwd.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      pwd.strength === 'STRONG' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {pwd.strength}
                    </span>
                    <span className="text-xs text-slate-500">Changed {pwd.lastChanged}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'storage':
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2 mb-4">
              <Database className="text-blue-500" size={18} /> STORAGE CLEANER
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-center">
                <p className="text-xs text-slate-400 mb-1">Cache</p>
                <p className="text-lg font-bold text-yellow-400">{cacheSize}</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-center">
                <p className="text-xs text-slate-400 mb-1">Temp Files</p>
                <p className="text-lg font-bold text-orange-400">{tempFiles}</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-center">
                <p className="text-xs text-slate-400 mb-1">Cookies</p>
                <p className="text-lg font-bold text-pink-400">{cookies}</p>
              </div>
            </div>

            <button
              onClick={handleCleanCache}
              disabled={cleaning}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)] disabled:opacity-50"
            >
              {cleaning ? 'Cleaning...' : 'Clean All Now'}
            </button>

            <h3 className="text-white font-bold flex items-center gap-2 mt-8 mb-4">
              <Cookie size={18} className="text-slate-400" /> COOKIE MANAGER
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cookies_data.map((cookie) => (
                <div key={cookie.id} className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-white text-sm font-mono">{cookie.site}</p>
                    <p className="text-xs text-slate-400">{cookie.type} · {cookie.size}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCookie(cookie.id)}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'monitor':
        return (
          <div className="space-y-4">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Cpu className="text-blue-500" /> PERMISSION LOG
            </h2>
            {appsData.map((app, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-700 p-5 rounded-2xl flex justify-between items-center"
              >
                <span className="text-white font-mono">{app.name}</span>
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    app.status === 'CRITICAL'
                      ? 'bg-red-900 text-red-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        );

      case 'scanner':
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Cpu className="text-blue-500" /> PERMISSION SCANNER
            </h2>

            <button
              onClick={runPermissionScan}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              SCAN NOW
            </button>

            {scanResults.map((item, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-700 p-5 rounded-2xl"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-white font-mono">{item.app}</span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.risk > 70
                        ? 'bg-red-900 text-red-300'
                        : item.risk > 40
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-green-900 text-green-300'
                    }`}
                  >
                    RISK {item.risk}%
                  </span>
                </div>
                <div className="text-blue-400 text-xs font-mono space-y-1">
                  {item.permissions.map((p, idx) => (
                    <p key={idx}>• {p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'malware':
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2">
              <ShieldAlert className="text-red-500" /> MALWARE DETECTOR
            </h2>

            <button
              onClick={runMalwareScan}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            >
              RUN MALWARE SCAN
            </button>

            {malwareResults.map((item, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-700 p-5 rounded-2xl"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-white font-mono">{item.app}</span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.risk > 70
                        ? 'bg-red-900 text-red-300'
                        : item.risk > 40
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-green-900 text-green-300'
                    }`}
                  >
                    RISK {item.risk}%
                  </span>
                </div>
                <div className="text-red-400 text-xs font-mono space-y-1">
                  {item.signals.length === 0 && (
                    <p>No suspicious behavior detected.</p>
                  )}
                  {item.signals.map((s, idx) => (
                    <p key={idx}>• {s}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2">
              <BarChart2 className="text-blue-500" /> AI THREAT SCORE
            </h2>

            <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl text-xs text-slate-400 font-mono space-y-1">
              <p>Weight Formula:</p>
              <p>• Permission Risk = 35%</p>
              <p>• Malware Risk = 45%</p>
              <p>• Blocker Activity = 20%</p>
            </div>

            <button
              onClick={computeAIThreatScore}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            >
              Compute AI Threat Score
            </button>

            {aiThreatScore === null && (
              <p className="text-xs text-yellow-400 font-mono">
                * Run Permission Scanner and Malware Detector first
              </p>
            )}

            {aiThreatScore !== null && (
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-mono">
                      AI THREAT SCORE
                    </p>
                    <p className="text-4xl font-black tracking-tight text-white">
                      {aiThreatScore}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs font-mono">Level</p>
                    <p className="text-sm font-bold text-blue-400">
                      {getThreatLevel(aiThreatScore)}
                    </p>
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getThreatColor(
                      aiThreatScore
                    )} transition-all`}
                    style={{ width: `${aiThreatScore}%` }}
                  ></div>
                </div>

                <p className="text-xs text-slate-500 font-mono">
                  Calculated from permissions, malware behavior, and blocking activity
                </p>
              </div>
            )}
          </div>
        );

      case 'firewall':
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Lock className="text-blue-500" /> FIREWALL
            </h2>

            <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl">
              <p className="text-xs text-slate-400 mb-2 font-mono">ACTIVE RULES</p>
              <div className="space-y-2 text-xs font-mono">
                {firewallRules.map((rule) => (
                  <div key={rule.id} className="flex justify-between">
                    <span className="text-blue-400">{rule.pattern}</span>
                    <span
                      className={
                        rule.action === 'BLOCK'
                          ? 'text-red-400'
                          : 'text-green-400'
                      }
                    >
                      {rule.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={runFirewallEngine}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            >
              Run Traffic Scan
            </button>

            <div className="bg-slate-900 border border-slate-700 p-5 rounded-3xl flex justify-between text-sm">
              <div className="text-green-400 font-mono">
                <p className="text-xs text-slate-400">ALLOWED</p>
                <p className="text-2xl font-bold">{firewallStats.allowed}</p>
              </div>
              <div className="text-red-400 font-mono text-right">
                <p className="text-xs text-slate-400">BLOCKED</p>
                <p className="text-2xl font-bold">{firewallStats.blocked}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl">
              <p className="text-xs text-slate-400 mb-2 font-mono">FIREWALL LOG</p>
              <div className="space-y-2 max-h-40 overflow-y-auto text-[10px] font-mono">
                {firewallLog.length === 0 && (
                  <p className="text-slate-600">No traffic scanned yet</p>
                )}
                {firewallLog.map((entry, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-500">{entry.time}</span>
                    <span className="text-slate-300">{entry.app}</span>
                    <span className="text-blue-400">{entry.host}</span>
                    <span
                      className={
                        entry.action === 'BLOCK'
                          ? 'text-red-400'
                          : 'text-green-400'
                      }
                    >
                      {entry.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Settings className="text-blue-500" /> SETTINGS
            </h2>

            <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl">
              <h3 className="text-white font-bold mb-4">General Settings</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-slate-400 text-sm">Auto-Block Enabled</p>
                  <button className="w-14 h-8 rounded-full bg-blue-600 flex items-center px-1">
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-slate-400 text-sm">DNS Filtering</p>
                  <button className="w-14 h-8 rounded-full bg-blue-600 flex items-center px-1">
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl text-center">
              <p className="text-slate-400 text-xs">Privacy.OS v2.1.0</p>
              <p className="text-slate-600 text-[10px] mt-2">Advanced Security Suite</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-slate-950 font-sans">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-xl font-black text-white tracking-tighter">
          PRIVACY.OS
        </h1>
        <RefreshCw size={20} className={`${isBlockingEnabled ? 'animate-spin' : ''} text-slate-500`} />
      </header>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">{renderContent()}</main>

      <nav className="mx-6 mb-6 bg-slate-900 border border-slate-700 rounded-3xl p-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {[
            { id: 'dashboard', icon: Shield },
            { id: 'blocker', icon: XCircle },
            { id: 'encrypt', icon: Lock },
            { id: 'vpn', icon: Wifi },
            { id: 'passwords', icon: Key },
            { id: 'storage', icon: Database },
            { id: 'monitor', icon: Eye },
            { id: 'scanner', icon: Cpu },
            { id: 'malware', icon: ShieldAlert },
            { id: 'ai', icon: BarChart2 },
            { id: 'firewall', icon: Power },
            { id: 'settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-2xl transition-all flex-shrink-0 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                  : 'text-slate-500'
              }`}
              title={item.id}
            >
              <item.icon size={22} />
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
