import React, { useState, useMemo } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  TrendingDown,
  Filter,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { RecommendationPriority, RecommendationStatus } from '../../types/energy';
import { formatInr, formatKwh } from '../../utils/energyMath';

export const RecommendationsView: React.FC = () => {
  const { currentOrg, recommendations, updateRecommendationStatus } = useEnergy();

  const [statusFilter, setStatusFilter] = useState<'All' | RecommendationStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | RecommendationPriority>('All');

  const orgRecommendations = useMemo(() => {
    return recommendations.filter((r) => r.organizationId === currentOrg.id);
  }, [recommendations, currentOrg.id]);

  const filtered = useMemo(() => {
    return orgRecommendations.filter((r) => {
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (priorityFilter !== 'All' && r.priority !== priorityFilter) return false;
      return true;
    });
  }, [orgRecommendations, statusFilter, priorityFilter]);

  // Aggregate potential savings
  const totalPotentialSavingsInr = useMemo(() => {
    return orgRecommendations
      .filter((r) => r.status !== 'Dismissed')
      .reduce((sum, r) => sum + r.estimatedSavingsInr, 0);
  }, [orgRecommendations]);

  const totalPotentialSavingsKwh = useMemo(() => {
    return orgRecommendations
      .filter((r) => r.status !== 'Dismissed')
      .reduce((sum, r) => sum + r.estimatedSavingsKwh, 0);
  }, [orgRecommendations]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-400" />
            Smart Energy Recommendations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Algorithmic efficiency opportunities prioritizing HVAC schedules, peak clipping, and phantom load elimination.
          </p>
        </div>

        {/* Estimation Disclaimer */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">
          <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>Savings are calculated estimates based on tariff ₹{currentOrg.electricityTariff}/kWh, not guaranteed utility outcomes.</span>
        </div>
      </div>

      {/* Aggregate Savings Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-slate-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Total Addressable Optimization
          </span>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-extrabold text-white">
              {formatInr(totalPotentialSavingsInr)}
            </span>
            <span className="text-xs text-slate-400">/ estimated monthly cost reduction</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Equivalent to trimming <strong className="text-cyan-300 font-mono">{formatKwh(totalPotentialSavingsKwh)}</strong> of annual waste.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        {/* Status filter */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 p-1 text-xs">
          <span className="px-2 text-slate-400 text-[11px]">Status:</span>
          {(['All', 'Pending', 'In Progress', 'Completed', 'Dismissed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                statusFilter === s ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 p-1 text-xs">
          <span className="px-2 text-slate-400 text-[11px]">Priority:</span>
          {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                priorityFilter === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 text-sm">
            No recommendations match your current filter settings.
          </div>
        ) : (
          filtered.map((rec) => (
            <div
              key={rec.id}
              className={`rounded-2xl border p-5 backdrop-blur-sm transition-all ${
                rec.status === 'Completed'
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : rec.status === 'Dismissed'
                  ? 'border-slate-800 bg-slate-900/30 opacity-60'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  {/* Category, Priority, Status */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        rec.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : rec.priority === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>

                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] text-slate-300">
                      {rec.category}
                    </span>

                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 text-[11px]">
                      Updated: {new Date(rec.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{rec.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{rec.explanation}</p>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                    <span className="font-semibold text-cyan-400 block mb-1">Suggested Implementation Action:</span>
                    {rec.suggestedAction}
                  </div>
                </div>

                {/* Right Savings & Status Selector */}
                <div className="lg:w-64 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                  {/* Estimated Savings Box */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      Estimated Savings (Est.)
                    </span>
                    <div className="font-mono text-xl font-extrabold text-emerald-400 tabular-nums">
                      {formatInr(rec.estimatedSavingsInr)} / mo
                    </div>
                    <div className="text-xs font-mono text-cyan-300 tabular-nums">
                      {formatKwh(rec.estimatedSavingsKwh)} / mo
                    </div>
                  </div>

                  {/* Status buttons */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Update Status:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['Pending', 'In Progress', 'Completed', 'Dismissed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateRecommendationStatus(rec.id, st)}
                          className={`rounded-lg py-1.5 text-[11px] font-medium transition-colors ${
                            rec.status === st
                              ? st === 'Completed'
                                ? 'bg-emerald-600 text-white font-bold'
                                : st === 'In Progress'
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-slate-700 text-white font-bold'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
