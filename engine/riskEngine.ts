export interface RiskAssessment {
  score: number;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  risks: string[];
  recommendations: string[];
}

export function assessRisk(leaks: {
  webrtc: boolean;
  dns: boolean;
  vpn: boolean;
  fingerprint: string;
}): RiskAssessment {
  const risks: string[] = [];
  let score = 100;

  // WebRTC Leak Assessment
  if (leaks.webrtc) {
    risks.push('WebRTC IP leak detected - Real IP exposed');
    score -= 35;
  }

  // VPN Detection
  if (leaks.vpn) {
    risks.push('VPN usage detected - May indicate privacy concerns');
    score -= 15;
  }

  // DNS Leak
  if (leaks.dns) {
    risks.push('DNS leak detected - Queries may be monitored');
    score -= 25;
  }

  // Fingerprinting Risk
  const fingerprintEntropy = leaks.fingerprint.length;
  if (fingerprintEntropy < 60) {
    risks.push('Low fingerprint entropy - Device easily identifiable');
    score -= 20;
  }

  const recommendations: string[] = [];

  if (score < 50) {
    recommendations.push('Enable WebRTC leak protection in settings');
    recommendations.push('Use a reputable VPN service');
    recommendations.push('Configure DNS-over-HTTPS (DoH)');
    recommendations.push('Enable browser privacy features');
  } else if (score < 75) {
    recommendations.push('Review browser privacy settings');
    recommendations.push('Consider using a VPN for additional protection');
    recommendations.push('Update browser to latest version');
  }

  let level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  if (score < 30) level = 'CRITICAL';
  else if (score < 50) level = 'HIGH';
  else if (score < 75) level = 'MEDIUM';
  else level = 'LOW';

  return {
    score: Math.max(0, score),
    level,
    risks,
    recommendations,
  };
}
