import React, { useState, useMemo } from 'react';
import {
  Activity,
  Download,
  Filter,
  Search,
  Building as BuildingIcon,
  Cpu,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import {
  calculateEnergyTotals,
  filterReadingsByRange,
  generateCsvContent,
  downloadCsvFile,
  formatInr,
  formatKwh,
} from '../../utils/energyMath';
import { AreaConsumptionChart } from '../charts/EnergyCharts';

export const MonitoringView: React.FC = () => {
  const { currentOrg, buildings, devices, readings } = useEnergy();

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<'today' | '7d' | '30d' | '90d'>('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filter readings by org, time range, building, and device
  const orgReadings = useMemo(() => {
    return readings.filter((r) => r.organizationId === currentOrg.id);
  }, [readings, currentOrg.id]);

  const timeFiltered = useMemo(() => {
    return filterReadingsByRange(orgReadings, selectedRange, new Date('2026-11-07T12:00:00Z'));
  }, [orgReadings, selectedRange]);

  const fullyFiltered = useMemo(() => {
    return timeFiltered.filter((r) => {
      if (selectedBuildingId !== 'all' && r.buildingId !== selectedBuildingId) return false;
      if (selectedDeviceId !== 'all' && r.deviceId !== selectedDeviceId) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const b = buildings.find((b) => b.id === r.buildingId)?.name.toLowerCase() || '';
        const d = devices.find((d) => d.id === r.deviceId)?.name.toLowerCase() || '';
        if (!b.includes(query) && !d.includes(query) && !r.timestamp.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [timeFiltered, selectedBuildingId, selectedDeviceId, searchQuery, buildings, devices]);

  const totals = useMemo(() => {
    return calculateEnergyTotals(fullyFiltered, currentOrg.electricityTariff, currentOrg.peakTariffMultiplier);
  }, [fullyFiltered, currentOrg]);

  // Chart data
  const chartData = useMemo(() => {
    const map = new Map<string, { kwh: number; cost: number; isPeak: boolean }>();
    for (const r of fullyFiltered.slice(0, 100)) {
      const date = new Date(r.timestamp);
      const label =
        selectedRange === 'today'
          ? `${date.getHours().toString().padStart(2, '0')}:00`
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const cur = map.get(label) || { kwh: 0, cost: 0, isPeak: false };
      map.set(label, {
        kwh: cur.kwh + r.consumptionKwh,
        cost: cur.cost + r.costInr,
        isPeak: cur.isPeak || r.isPeak,
      });
    }

    return Array.from(map.entries()).map(([label, val]) => ({
      label,
      consumptionKwh: Math.round(val.kwh * 10) / 10,
      costInr: Math.round(val.cost * 100) / 100,
      isPeak: val.isPeak,
    }));
  }, [fullyFiltered, selectedRange]);

  // Pagination for table
  const totalPages = Math.max(1, Math.ceil(fullyFiltered.length / pageSize));
  const paginatedReadings = fullyFiltered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // CSV export handler
  const handleExportCsv = () => {
    const exportData = fullyFiltered.map((r) => {
      const b = buildings.find((b) => b.id === r.buildingId);
      const d = devices.find((d) => d.id === r.deviceId);
      return {
        ReadingID: r.id,
        Timestamp: r.timestamp,
        Building: b?.name || r.buildingId,
        Device: d?.name || r.deviceId,
        Category: d?.category || 'General',
        Consumption_kWh: r.consumptionKwh,
        Cost_INR: r.costInr,
        TariffWindow: r.isPeak ? 'Peak' : 'Standard',
        DataSource: r.dataSource,
      };
    });

    const csv = generateCsvContent(exportData);
    downloadCsvFile(csv, `Qyrenza_Monitoring_${currentOrg.name.replace(/\s+/g, '_')}_${selectedRange}.csv`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & DEMO DATA NOTICE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-cyan-400" />
            Energy Monitoring
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry streams, sub-hourly intervals, and historical reading records.
          </p>
        </div>

        {/* Clear Demo Data Compliance Notice */}
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 px-3.5 py-2 text-xs text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            <strong className="font-semibold text-amber-300">DEMO DATA NOTICE:</strong> Simulated energy readings for
            testing and baseline evaluation. Connect physical IoT/Modbus hardware via the Gateway API for live field telemetry.
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Building Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Building Filter</label>
            <select
              value={selectedBuildingId}
              onChange={(e) => {
                setSelectedBuildingId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Buildings ({buildings.length})</option>
              {buildings
                .filter((b) => b.organizationId === currentOrg.id)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Device Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Device Filter</label>
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Equipment & Meters</option>
              {devices
                .filter(
                  (d) =>
                    d.organizationId === currentOrg.id &&
                    (selectedBuildingId === 'all' || d.buildingId === selectedBuildingId)
                )
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.category})
                  </option>
                ))}
            </select>
          </div>

          {/* Time Range Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Time Horizon</label>
            <div className="grid grid-cols-4 gap-1">
              {(['today', '7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRange(r);
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg py-2 text-xs font-medium uppercase transition-colors ${
                    selectedRange === r
                      ? 'bg-cyan-500 text-white font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Export Action */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Search & Export</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-8 pr-2.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <button
                onClick={handleExportCsv}
                title="Download CSV"
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors shrink-0"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Total Filtered Readings: <strong className="text-white font-mono">{fullyFiltered.length}</strong>
            </span>
            <span>·</span>
            <span>
              Active Consumption:{' '}
              <strong className="text-cyan-400 font-mono">{formatKwh(totals.totalKwh)}</strong>
            </span>
            <span>·</span>
            <span>
              Estimated Cost:{' '}
              <strong className="text-emerald-400 font-mono">{formatInr(totals.totalCostInr)}</strong>
            </span>
          </div>

          {(selectedBuildingId !== 'all' || selectedDeviceId !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBuildingId('all');
                setSelectedDeviceId('all');
                setSearchQuery('');
              }}
              className="text-xs text-cyan-400 hover:underline cursor-pointer"
            >
              Reset active filters
            </button>
          )}
        </div>
      </div>

      {/* Interactive Monitoring Chart */}
      <AreaConsumptionChart
        data={chartData}
        title={`Energy Demand Curve (${selectedRange.toUpperCase()}) — ${
          selectedBuildingId === 'all'
            ? 'All Buildings'
            : buildings.find((b) => b.id === selectedBuildingId)?.name
        }`}
        height={240}
      />

      {/* Consumption Table with Real Telemetry Attributes */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">Meter Consumption Telemetry Log</h3>
          <span className="text-xs text-slate-400 font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Building</th>
                <th className="py-3 px-4 font-semibold">Device / Meter</th>
                <th className="py-3 px-4 font-semibold text-right">Consumption</th>
                <th className="py-3 px-4 font-semibold text-right">Tariff Cost</th>
                <th className="py-3 px-4 font-semibold">Rate Window</th>
                <th className="py-3 px-4 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedReadings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No readings match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedReadings.map((r) => {
                  const b = buildings.find((b) => b.id === r.buildingId);
                  const d = devices.find((d) => d.id === r.deviceId);
                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {new Date(r.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{b?.name || 'Campus Building'}</td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="font-medium text-slate-200">{d?.name || 'Sub-Meter'}</span>
                        <span className="text-[10px] text-slate-500 block">{d?.category}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-cyan-300 tabular-nums">
                        {r.consumptionKwh.toFixed(1)} kWh
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-emerald-300 tabular-nums">
                        {formatInr(r.costInr)}
                      </td>
                      <td className="py-3 px-4">
                        {r.isPeak ? (
                          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                            Peak ({currentOrg.peakTariffMultiplier}x)
                          </span>
                        ) : (
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-full bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300">
                          {r.dataSource}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800 text-xs">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
            >
              Previous
            </button>
            <span className="text-slate-400">
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, fullyFiltered.length)} of {fullyFiltered.length}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
