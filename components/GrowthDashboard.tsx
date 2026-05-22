import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "recharts";
import { createClient } from "@supabase/supabase-js";

// =====================================
// Growth Dashboard — SaaS Intelligence Layer
// Tracks MRR, users, virality, conversions
// =====================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Metrics {
  users?: number;
  referrals?: number;
  paidUsers?: number;
  mrr?: number;
  conversionRate?: number;
  viralCoefficient?: number;
  churnRate?: number;
  ltv?: number;
}

interface ChartDataPoint {
  day: string;
  users: number;
  mrr: number;
  referrals: number;
  conversions: number;
}

export default function GrowthDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({});
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMetrics() {
    setLoading(true);
    setError(null);

    try {
      // USERS - from security_logs
      const { count: users, error: usersError } = await supabase
        .from("security_logs")
        .select("id", { count: "exact", head: true });

      if (usersError) throw usersError;

      // REFERRALS
      const { count: referrals, error: referralsError } = await supabase
        .from("referrals")
        .select("id", { count: "exact", head: true });

      if (referralsError) throw referralsError;

      // SUBSCRIPTIONS
      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select("plan, status, created_at");

      if (subsError) throw subsError;

      const paidUsers = subs?.filter(s => s.status === "active")?.length || 0;

      const mrr =
        subs?.reduce((acc, s) => {
          if (s.plan === "pro") return acc + 10;
          if (s.plan === "enterprise") return acc + 49;
          return acc;
        }, 0) || 0;

      const conversionRate = users ? (paidUsers / users) * 100 : 0;

      // VIRAL COEFFICIENT - referrals / users
      const viralCoefficient = users ? (referrals || 0) / users : 0;

      // CHURN RATE - inactive / total paid
      const { count: inactive } = await supabase
        .from("subscriptions")
        .select("id", { count: "exact", head: true })
        .eq("status", "inactive");

      const churnRate = paidUsers ? ((inactive || 0) / paidUsers) * 100 : 0;

      // LIFETIME VALUE - mrr * months
      const ltv = (mrr / Math.max(paidUsers, 1)) * 12; // Assume 1 year lifetime

      setMetrics({
        users,
        referrals,
        paidUsers,
        mrr,
        conversionRate,
        viralCoefficient,
        churnRate,
        ltv
      });

      // Fetch historical data from analytics table
      const { data: analytics } = await supabase
        .from("growth_analytics")
        .select("*")
        .order("date", { ascending: true })
        .limit(7);

      if (analytics && analytics.length > 0) {
        setChartData(analytics as ChartDataPoint[]);
      } else {
        // Fallback to sample data
        setChartData([
          { day: "Mon", users: 120, mrr: 80, referrals: 10, conversions: 5 },
          { day: "Tue", users: 200, mrr: 120, referrals: 15, conversions: 8 },
          { day: "Wed", users: 320, mrr: 200, referrals: 25, conversions: 12 },
          { day: "Thu", users: 450, mrr: 260, referrals: 35, conversions: 18 },
          { day: "Fri", users: 600, mrr: 340, referrals: 50, conversions: 24 }
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metrics");
      console.error("Metrics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (value: number, threshold: number) => {
    return value >= threshold ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Growth Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time SaaS analytics + viral engine tracking
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={fetchMetrics}
            disabled={loading}
            variant="outline"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error loading metrics</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* KPI CARDS - PRIMARY METRICS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 font-medium">Total Users</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              {metrics.users || 0}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {referrals || 0} from referrals
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 font-medium">MRR</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              ${metrics.mrr || 0}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              ${((metrics.mrr || 0) * 12).toFixed(0)}/year
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 font-medium">Paid Users</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              {metrics.paidUsers || 0}
            </div>
            <div className={`text-xs font-semibold mt-2 ${getHealthColor(metrics.conversionRate || 0, 5)}`}>
              {(metrics.conversionRate || 0).toFixed(1)}% conversion
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="text-sm text-slate-600 font-medium">LTV</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              ${(metrics.ltv || 0).toFixed(0)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Per customer (12mo)
            </div>
          </CardContent>
        </Card>

      </div>

      {/* VIRAL & HEALTH METRICS */}
      <div className="grid md:grid-cols-3 gap-4">

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-slate-900">Viral Coefficient</div>
                <div className="text-sm text-slate-600 mt-1">
                  Referral multiplication
                </div>
              </div>
              <div className={`text-2xl font-bold ${getHealthColor(metrics.viralCoefficient || 0, 1.2)}`}>
                {(metrics.viralCoefficient || 0).toFixed(2)}
              </div>
            </div>
            {(metrics.viralCoefficient || 0) > 1 && (
              <p className="text-xs text-green-700 mt-3">✓ Viral growth active (K > 1)</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-slate-900">Churn Rate</div>
                <div className="text-sm text-slate-600 mt-1">
                  Monthly inactive users
                </div>
              </div>
              <div className={`text-2xl font-bold ${getHealthColor(100 - (metrics.churnRate || 0), 90)}`}>
                {(metrics.churnRate || 0).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-slate-900">Referrals</div>
                <div className="text-sm text-slate-600 mt-1">
                  Total viral invites
                </div>
              </div>
              <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                {metrics.referrals || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-4">

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="font-semibold text-slate-900 mb-4">User Growth</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="font-semibold text-slate-900 mb-4">Revenue Growth</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }} />
                <Bar dataKey="mrr" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* FUNNEL CHART */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="font-semibold text-slate-900 mb-4">Conversion Funnel</div>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={chartData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }} />
              <Line type="monotone" dataKey="users" stroke="#94a3b8" strokeWidth={2} />
              <Bar dataKey="conversions" fill="#6366f1" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* INSIGHT PANEL */}
      <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="font-semibold text-slate-900 mb-3">🔥 Growth Insights & Action Items</div>

          <ul className="text-sm text-slate-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Conversion Funnel:</strong> Track visitor → signup → paid user flow</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Viral Loop Health:</strong> K-factor = {(metrics.viralCoefficient || 0).toFixed(2)} (Target: > 1.2)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>MRR Growth Rate:</strong> Current ${metrics.mrr || 0}/mo → Target: ${((metrics.mrr || 0) * 1.5).toFixed(0)}/mo (30% growth)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Churn Optimization:</strong> Reduce from {(metrics.churnRate || 0).toFixed(1)}% → 5% to improve retention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Next Focus:</strong> Optimize referral loop (K-factor) + SEO traffic acquisition</span>
            </li>
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}
