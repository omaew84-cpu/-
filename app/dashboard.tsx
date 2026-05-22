'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMetrics() {
    setLoading(true);
    setError(null);

    try {
      // Users
      const { count: users } = await supabase
        .from('security_logs')
        .select('id', { count: 'exact', head: true });

      // Referrals
      const { count: referrals } = await supabase
        .from('referrals')
        .select('id', { count: 'exact', head: true });

      // Subscriptions
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('plan, status');

      const paidUsers = subs?.filter(s => s.status === 'active')?.length || 0;

      const mrr =
        subs?.reduce((acc, s) => {
          if (s.plan === 'pro') return acc + 9.99;
          if (s.plan === 'enterprise') return acc + 49.99;
          return acc;
        }, 0) || 0;

      const conversionRate = users ? (paidUsers / users) * 100 : 0;

      // Analytics
      const { data: analytics } = await supabase
        .from('growth_analytics')
        .select('*')
        .order('date', { ascending: true })
        .limit(7);

      setMetrics({
        users,
        referrals,
        paidUsers,
        mrr,
        conversionRate,
        viralCoefficient: users ? (referrals || 0) / users : 0,
      });

      if (analytics) {
        setChartData(analytics);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching metrics');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Growth Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time SaaS analytics + viral engine tracking
          </p>
        </div>
        <Button onClick={fetchMetrics} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 font-medium">Total Users</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              {metrics.users || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 font-medium">MRR</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              ${(metrics.mrr || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 font-medium">Paid Users</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              {metrics.paidUsers || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 font-medium">Conversion</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              {(metrics.conversionRate || 0).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viral Metrics */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-slate-900">Viral Engine Health</div>
              <div className="text-sm text-slate-600 mt-1">
                K-factor: {(metrics.viralCoefficient || 0).toFixed(2)}
              </div>
            </div>
            <Badge className="bg-blue-600 text-white text-lg px-3 py-1">
              {metrics.referrals || 0} referrals
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="font-semibold text-slate-900 mb-4">User Growth</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="font-semibold text-slate-900 mb-4">MRR Growth</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mrr" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="font-semibold text-slate-900 mb-3">Growth Action Items</div>
          <ul className="text-sm text-slate-700 space-y-2">
            <li>• Optimize conversion funnel (Current: {(metrics.conversionRate || 0).toFixed(1)}%)</li>
            <li>• Improve viral loop (K-factor: {(metrics.viralCoefficient || 0).toFixed(2)})</li>
            <li>• Scale user acquisition channels</li>
            <li>• Reduce churn rate</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
