import React, { useState, useMemo } from 'react';
import {
  Zap,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Building,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import {
  calculateEnergyTotals,
  calculateEfficiencyScore,
  filterReadingsByRange,
  formatInr,
  formatKwh,
  getUserFirstName,
} from '../../utils/energyMath';
import { AreaConsumptionChart, BarComparisonChart, DonutEfficiency } from '../charts/EnergyCharts';

interface OverviewViewProps {
  onNavigateToView: (view: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateToView }) => {
  const { user, currentOrg, buildings, devices, readings, anomalies, recommendations } = useEnergy();

  const [filterRange, setFilterRange] = useState<'today' | '7d' | '30d' | '90d' | 'custom'>('7d');
  const [customStart, setCustomStart] = useState('2026-11-01');
  const [customEnd, setCustomEnd] = useState('2026-11-07');
  const [chartView, setChartView] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');

  // Filter readings based on active range
  const filteredReadings = useMemo(() => {
    return filterReadingsByRange(
      readings.filter((r) => r.organizationId === currentOrg.id),
      filterRange,
      new Date('2026-11-07T12:00:00Z'),
      customStart,
      customEnd
    );
  }, [readings, currentOrg.id, filterRange, customStart, customEnd]);

  // Totals
  const totals = useMemo(() => {
    return calculateEnergyTotals(filteredReadings, currentOrg.electricityTariff, currentOrg.peakTariffMultiplier);
  }, [filteredReadings, currentOrg]);

  // Overall campus efficiency score
  const totalBaselineKwh = useMemo(() => {
    const daysMultiplier = filterRange === 'today' ? 1 : filterRange === '7d' ? 7 : filterRange === '30d' ? 30 : 90;
    return buildings
      .filter((b) => b.organizationId === currentOrg.id)
      .reduce((sum, b) => sum + b.baselineKwhDaily * daysMultiplier, 0);
  }, [buildings, currentOrg.id, filterRange]);

  const activeAnomaliesCount = useMemo(() => {
    return anomalies.filter((a) => a.organizationId === currentOrg.id && a.status === 'Detected').length;
  }, [anomalies, currentOrg.id]);

  const efficiencyScore = useMemo(() => {
    return calculateEfficiencyScore(totals.totalKwh, totalBaselineKwh, activeAnomaliesCount);
  }, [totals.totalKwh, totalBaselineKwh, activeAnomaliesCount]);

  // Energy saved estimate (~8.5% efficiency baseline saving)
  const energySavedKwh = useMemo(() => {
    return Math.round(totals.totalKwh * 0.082 * 10) / 10;
  }, [totals.totalKwh]);

  // Chart data points based on chartView
  const chartPoints = useMemo(() => {
    if (chartView === 'hourly') {
      // Group by hour of day (0-23)
      const hourlyMap = new Array(24).fill(0).map((_, h) => ({
        label: `${h.toString().padStart(2, '0')}:00`,
        kwh: 0,
        cost: 0,
        isPeak: h >= 9 && h <= 18,
      }));
      for (const r of filteredReadings) {
        const hour = new Date(r.timestamp).getHours();
        hourlyMap[hour].kwh += r.consumptionKwh;
        hourlyMap[hour].cost += r.costInr;
      }
      return hourlyMap.map((h) => ({
        label: h.label,
        consumptionKwh: Math.round(h.kwh * 10) / 10,
        costInr: Math.round(h.cost * 100) / 100,
        isPeak: h.isPeak,
      }));
    } else if (chartView === 'daily') {
      // Group by date
      const map = new Map<string, { kwh: number; cost: number }>();
      for (const r of filteredReadings) {
        const dayKey = new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const cur = map.get(dayKey) || { kwh: 0, cost: 0 };
        map.set(dayKey, { kwh: cur.kwh + r.consumptionKwh, cost: cur.cost + r.costInr });
      }
      return Array.from(map.entries()).map(([label, val]) => ({
        label,
        consumptionKwh: Math.round(val.kwh * 10) / 10,
        costInr: Math.round(val.cost * 100) / 100,
      }));
    } else if (chartView === 'weekly') {
      // Group by day of week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const map = new Array(7).fill(0).map((_, i) => ({ label: days[i], kwh: 0, cost: 0 }));
      for (const r of filteredReadings) {
        const d = new Date(r.timestamp).getDay();
        map[d].kwh += r.consumptionKwh;
        map[d].cost += r.costInr;
      }
      return map.map((m) => ({
        label: m.label,
        consumptionKwh: Math.round(m.kwh * 10) / 10,
        costInr: Math.round(m.cost * 100) / 100,
      }));
    } else {
      // Monthly trends
      const map = new Map<string, { kwh: number; cost: number }>();
      for (const r of filteredReadings) {
        const monthKey = new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short' });
        const cur = map.get(monthKey) || { kwh: 0, cost: 0 };
        map.set(monthKey, { kwh: cur.kwh + r.consumptionKwh, cost: cur.cost + r.costInr });
      }
      return Array.from(map.entries()).map(([label, val]) => ({
        label,
        consumptionKwh: Math.round(val.kwh * 10) / 10,
        costInr: Math.round(val.cost * 100) / 100,
      }));
    }
  }, [chartView, filteredReadings]);

  // Building comparisons
  const buildingComparisonData = useMemo(() => {
    const orgBuildings = buildings.filter((b) => b.organizationId === currentOrg.id);
    return orgBuildings.map((b) => {
      const bReadings = filteredReadings.filter((r) => r.buildingId === b.id);
      const sum = bReadings.reduce((acc, r) => acc + r.consumptionKwh, 0);
      return {
        label: b.name,
        value: Math.round(sum * 10) / 10,
      };
    });
  }, [buildings, currentOrg.id, filteredReadings]);

  // Equipment category comparison
  const equipmentComparisonData = useMemo(() => {
    const catMap = new Map<string, number>();
    for (const r of filteredReadings) {
      const dev = devices.find((d) => d.id === r.deviceId);
      const cat = dev ? dev.category : 'Other';
      catMap.set(cat, (catMap.get(cat) || 0) + r.consumptionKwh);
    }
    return Array.from(catMap.entries()).map(([label, val]) => ({
      label,
      value: Math.round(val * 10) / 10,
    }));
  }, [devices, filteredReadings]);

  const recentAnomalies = anomalies
    .filter((a) => a.organizationId === currentOrg.id)
    .slice(0, 3);

  const recentRecommendations = recommendations
    .filter((r) => r.organizationId === currentOrg.id)
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Welcome back, {getUserFirstName(user?.name)}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time energy telemetry and performance analytics for {currentOrg.name}.
          </p>
        </div>

        {/* Range Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 p-1">
            {(['today', '7d', '30d', '90d', 'custom'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRange(r)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  filterRange === r ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'today'
                  ? 'Today'
                  : r === '7d'
                  ? 'Last 7 Days'
                  : r === '30d'
                  ? 'Last 30 Days'
                  : r === '90d'
                  ? 'Last 90 Days'
                  : 'Custom'}
              </button>
            ))}
          </div>

          {filterRange === 'custom' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white"
              />
              <span>to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Energy Consumption */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Energy Consumption</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            {formatKwh(totals.totalKwh)}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Peak: {formatKwh(totals.peakKwh)}</span>
            <span>·</span>
            <span>Off-Peak: {formatKwh(totals.offPeakKwh)}</span>
          </div>
        </div>

        {/* Estimated Electricity Cost */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Estimated Electricity Cost</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            {formatInr(totals.totalCostInr)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Effective Tariff: ₹{currentOrg.electricityTariff.toFixed(2)}/kWh (Peak: {currentOrg.peakTariffMultiplier}x)
          </div>
        </div>

        {/* Energy Saved */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Energy Saved</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 font-mono text-2xl sm:text-3xl font-extrabold text-cyan-400 tabular-nums">
            {formatKwh(energySavedKwh)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">
            ~ {formatInr(energySavedKwh * currentOrg.electricityTariff)} estimated bill reduction
          </div>
        </div>

        {/* Efficiency Score */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Efficiency Score</span>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {efficiencyScore}%
            </div>
            <div className="mt-1 text-[11px] text-cyan-400 font-medium">
              {efficiencyScore >= 85 ? 'Optimal Performance' : 'Action Recommended'}
            </div>
          </div>
          <DonutEfficiency score={efficiencyScore} size={70} label="" />
        </div>
      </div>

      {/* Main Interactive Consumption Chart with Granularity Switcher */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100">Consumption Profile</h3>
            <span className="text-xs text-slate-400">({chartPoints.length} aggregate periods)</span>
          </div>

          {/* Hourly / Daily / Weekly / Monthly Switch */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 self-start">
            {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setChartView(v)}
                className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  chartView === v ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <AreaConsumptionChart
          data={chartPoints}
          baselineKwh={chartView === 'hourly' ? 28 : undefined}
          title={`${currentOrg.name} — ${chartView.toUpperCase()} LOAD PROFILE (kWh)`}
          height={260}
        />
      </div>

      {/* Building & Equipment Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarComparisonChart
          data={buildingComparisonData}
          unit="kWh"
          title="Building-Wise Consumption Comparison"
        />
        <BarComparisonChart
          data={equipmentComparisonData}
          unit="kWh"
          title="Equipment Category Consumption Breakdown"
        />
      </div>

      {/* Peak-Demand Indicator & Recent Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Peak Demand Status Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Peak-Demand Indicator</h4>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              Active Monitoring
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Current tariff billing window applies a{' '}
            <span className="font-semibold text-amber-300">{currentOrg.peakTariffMultiplier}x surcharge</span> during peak
            hours (09:00 AM - 06:00 PM).
          </p>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Peak Energy Proportion:</span>
              <span className="font-mono text-cyan-400 font-semibold">
                {totals.totalKwh > 0 ? Math.round((totals.peakKwh / totals.totalKwh) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Average Hourly Consumption:</span>
              <span className="font-mono text-white font-semibold">{totals.averageHourlyKwh} kWh/hr</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateToView('analytics')}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span>View Peak Load Shifting Analytics</span>
            <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Recent Anomalies Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Recent Anomalies</h4>
            <button
              onClick={() => onNavigateToView('anomalies')}
              className="text-xs text-cyan-400 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentAnomalies.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No anomalies detected.</p>
            ) : (
              recentAnomalies.map((a) => (
                <div key={a.id} className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200 truncate">{a.buildingName}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        a.severity === 'High'
                          ? 'text-rose-400'
                          : a.severity === 'Medium'
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      }`}
                    >
                      +{a.differencePercentage}% Surge
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">{a.explanation}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Recommendations Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Smart Recommendations</h4>
            <button
              onClick={() => onNavigateToView('recommendations')}
              className="text-xs text-cyan-400 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentRecommendations.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No pending recommendations.</p>
            ) : (
              recentRecommendations.map((r) => (
                <div key={r.id} className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200 truncate">{r.title}</span>
                    <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                      +{formatInr(r.estimatedSavingsInr)}/mo
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{r.category}</span>
                    <span className="text-[10px] text-cyan-300 font-medium">{r.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
