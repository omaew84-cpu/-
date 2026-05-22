'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { runFullScan } from '@/engine/scanEngine';
import { assessRisk } from '@/engine/riskEngine';
import { shareResult } from '@/engine/viralEngine';
import Link from 'next/link';

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);

  async function handleScan() {
    setIsScanning(true);
    try {
      const result = await runFullScan();
      setScanResult(result);
      const assessment = assessRisk(result.leaks);
      setRiskAssessment(assessment);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  }

  async function handleShare() {
    if (scanResult) {
      await shareResult(
        {
          score: scanResult.score,
          riskLevel: scanResult.riskLevel,
          deviceId: 'device_' + Date.now(),
          timestamp: scanResult.timestamp,
        },
        'native'
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Privacy Intelligence</h1>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button>Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Detect Your Exposure in Real Time
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            WebRTC leaks, DNS exposure, VPN detection — all in seconds
          </p>
          <Button
            size="lg"
            onClick={handleScan}
            disabled={isScanning}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isScanning ? 'Scanning...' : 'Start Free Scan'}
          </Button>
        </div>

        {/* Scan Result Card */}
        {scanResult && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-slate-800 border-slate-700 mb-8">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-white mb-2">
                    {scanResult.score}
                    <span className="text-3xl text-slate-400">/100</span>
                  </div>
                  <Badge
                    className={`text-lg py-1 px-4 ${
                      scanResult.riskLevel === 'LOW'
                        ? 'bg-green-600'
                        : scanResult.riskLevel === 'MEDIUM'
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {scanResult.riskLevel} RISK
                  </Badge>
                </div>

                {/* Leaks Detected */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-white">Leaks Detected:</h3>
                  <div className="space-y-2">
                    {scanResult.leaks.webrtc && (
                      <div className="flex items-center gap-2 text-red-400">
                        <span>🔴</span> WebRTC IP Leak Detected
                      </div>
                    )}
                    {scanResult.leaks.vpn && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <span>🟡</span> VPN Usage Detected
                      </div>
                    )}
                    {scanResult.leaks.dns && (
                      <div className="flex items-center gap-2 text-red-400">
                        <span>🔴</span> DNS Leak Detected
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Assessment */}
                {riskAssessment && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-white mb-2">Risks:</h3>
                      <ul className="space-y-1 text-sm text-slate-300">
                        {riskAssessment.risks.map((risk: string, i: number) => (
                          <li key={i}>• {risk}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        Recommendations:
                      </h3>
                      <ul className="space-y-1 text-sm text-slate-300">
                        {riskAssessment.recommendations.map(
                          (rec: string, i: number) => (
                            <li key={i}>✓ {rec}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share & Signup */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleShare}
                className="text-white border-slate-600 hover:bg-slate-700"
              >
                📤 Share Result
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Sign Up (Free)
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Simple, Transparent Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-slate-300 mb-6">$0/month</p>
              <ul className="space-y-2 text-slate-300 mb-6">
                <li>✓ 1 scan/day</li>
                <li>✓ Basic risk assessment</li>
                <li>✓ Share results</li>
              </ul>
              <Button variant="outline" className="w-full text-white">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500 shadow-xl scale-105">
            <CardContent className="p-6">
              <Badge className="bg-yellow-500 text-black mb-4">POPULAR</Badge>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-white mb-6 text-sm opacity-90">$9.99/month</p>
              <ul className="space-y-2 text-white mb-6">
                <li>✓ Unlimited scans</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Detailed reports</li>
                <li>✓ Priority support</li>
              </ul>
              <Button className="w-full bg-white text-purple-600 hover:bg-slate-100">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-slate-300 mb-6">$49.99/month</p>
              <ul className="space-y-2 text-slate-300 mb-6">
                <li>✓ All Pro features</li>
                <li>✓ API access</li>
                <li>✓ Custom integrations</li>
                <li>✓ Dedicated support</li>
              </ul>
              <Button variant="outline" className="w-full text-white">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
