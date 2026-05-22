import UAParser from 'ua-parser-js';

export interface ScanResult {
  score: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  leaks: {
    webrtc: boolean;
    dns: boolean;
    vpn: boolean;
  };
  fingerprint: string;
  timestamp: number;
}

// Detect WebRTC leak
export async function detectWebRTCLeak(): Promise<string | null> {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    let ipFound = false;

    pc.createDataChannel('');
    pc.createOffer().then((offer) => pc.setLocalDescription(offer));

    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate) return;
      const ipAddress = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(
        ice.candidate.candidate
      );
      if (ipAddress && !ipFound) {
        ipFound = true;
        pc.close();
        resolve(ipAddress[1]);
      }
    };

    setTimeout(() => {
      pc.close();
      resolve(null);
    }, 3000);
  });
}

// Get IP Information
export async function getIPInfo() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip: data.ip,
      country: data.country_name,
      city: data.city,
      isVPN: data.org.includes('VPN') || data.org.includes('Proxy'),
      isp: data.org,
    };
  } catch (error) {
    console.error('IP detection error:', error);
    return null;
  }
}

// Generate Device Fingerprint
export function getFingerprint(): string {
  const parser = new UAParser();
  const ua = parser.getResult();
  const canvas = generateCanvasFingerprint();
  const webgl = generateWebGLFingerprint();

  const fingerprintData = {
    ua: ua.ua,
    browser: ua.browser.name,
    os: ua.os.name,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    plugins: Array.from(navigator.plugins || [])
      .map((p) => p.name)
      .join(','),
    canvas,
    webgl,
  };

  return btoa(JSON.stringify(fingerprintData));
}

// Canvas Fingerprinting
function generateCanvasFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Privacy Intelligence', 2, 2);
  return canvas.toDataURL();
}

// WebGL Fingerprinting
function generateWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl')!;
    return gl.getParameter(gl.RENDERER);
  } catch {
    return 'unknown';
  }
}

// Main Scan Function
export async function runFullScan(): Promise<ScanResult> {
  const webrtcIp = await detectWebRTCLeak();
  const ipInfo = await getIPInfo();
  const fingerprint = getFingerprint();

  const score = calculateRiskScore({
    webrtcIp: !!webrtcIp,
    vpnDetected: ipInfo?.isVPN || false,
    fingerprintEntropy: fingerprint.length,
  });

  return {
    score,
    riskLevel: score < 50 ? 'HIGH' : score < 75 ? 'MEDIUM' : 'LOW',
    leaks: {
      webrtc: !!webrtcIp,
      dns: false, // Would require backend
      vpn: ipInfo?.isVPN || false,
    },
    fingerprint,
    timestamp: Date.now(),
  };
}

// Risk Score Calculation
function calculateRiskScore(leaks: {
  webrtcIp: boolean;
  vpnDetected: boolean;
  fingerprintEntropy: number;
}): number {
  let risk = 100; // Start at 100 (safe)

  if (leaks.webrtcIp) risk -= 35;
  if (leaks.vpnDetected) risk -= 15;
  if (leaks.fingerprintEntropy < 60) risk -= 20;

  return Math.max(0, risk);
}
