import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
  HelpCircle,
  FileText,
  X,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { Anomaly, AnomalySeverity, AnomalyStatus } from '../../types/energy';

export const AnomaliesView: React.FC = () => {
  const { currentOrg, anomalies, acknowledgeAnomaly, resolveAnomaly } = useEnergy();

  const [severityFilter, setSeverityFilter] = useState<'All' | AnomalySeverity>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | AnomalyStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal for notes and resolution
  const [activeModalAnomaly, setActiveModalAnomaly] = useState<Anomaly | null>(null);
  const [modalAction, setModalAction] = useState<'acknowledge' | 'resolve'>('acknowledge');
  const [actionNotes, setActionNotes] = useState('');

  const orgAnomalies = useMemo(() => {
    return anomalies.filter((a) => a.organizationId === currentOrg.id);
  }, [anomalies, currentOrg.id]);

  const filtered = useMemo(() => {
    return orgAnomalies.filter((a) => {
      if (severityFilter !== 'All' && a.severity !== severityFilter) return false;
      if (statusFilter !== 'All' && a.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.buildingName.toLowerCase().includes(q) ||
          a.deviceName.toLowerCase().includes(q) ||
          a.explanation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orgAnomalies, severityFilter, statusFilter, searchQuery]);

  const handleOpenActionModal = (anomaly: Anomaly, action: 'acknowledge' | 'resolve') => {
    setActiveModalAnomaly(anomaly);
    setModalAction(action);
    setActionNotes(anomaly.notes || '');
  };

  const handleConfirmModalAction = () => {
    if (!activeModalAnomaly) return;
    if (modalAction === 'acknowledge') {
      acknowledgeAnomaly(activeModalAnomaly.id, actionNotes);
    } else {
      resolveAnomaly(activeModalAnomaly.id, actionNotes);
    }
    setActiveModalAnomaly(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
            Statistical Anomaly Detection
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule-based algorithmic detector isolating sudden spikes, baseload overrides, and phantom consumption.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Severity selector */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 p-1 text-xs">
            <span className="px-2 text-slate-400 text-[11px]">Severity:</span>
            {(['All', 'High', 'Medium', 'Low'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                  severityFilter === s ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 p-1 text-xs">
            <span className="px-2 text-slate-400 text-[11px]">Status:</span>
            {(['All', 'Detected', 'Acknowledged', 'Resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                  statusFilter === st ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search anomaly logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 text-sm">
            No energy anomalies match the selected filters.
          </div>
        ) : (
          filtered.map((anomaly) => (
            <div
              key={anomaly.id}
              className={`rounded-2xl border p-5 backdrop-blur-sm transition-all ${
                anomaly.status === 'Resolved'
                  ? 'border-slate-800 bg-slate-900/40 opacity-75'
                  : anomaly.severity === 'High'
                  ? 'border-rose-500/30 bg-rose-950/15'
                  : anomaly.severity === 'Medium'
                  ? 'border-amber-500/30 bg-amber-950/15'
                  : 'border-slate-800 bg-slate-900/70'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Badge & Detection time */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        anomaly.severity === 'High'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : anomaly.severity === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {anomaly.severity} Severity
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        anomaly.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : anomaly.status === 'Acknowledged'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Status: {anomaly.status}
                    </span>

                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Detected: {new Date(anomaly.detectionTime).toLocaleString()}
                    </span>
                  </div>

                  {/* Heading */}
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{anomaly.buildingName}</span>
                    <span className="text-slate-500 text-xs font-normal">›</span>
                    <span className="text-cyan-300 text-sm font-semibold">{anomaly.deviceName}</span>
                  </h3>

                  {/* Explanation */}
                  <p className="text-xs text-slate-300 leading-relaxed">{anomaly.explanation}</p>

                  {/* Recommended Action */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-300">
                    <span className="text-cyan-400 font-semibold block mb-0.5">Recommended Field Action:</span>
                    {anomaly.recommendedInvestigation}
                  </div>

                  {/* Existing Notes */}
                  {anomaly.notes && (
                    <div className="text-xs text-slate-400 flex items-start gap-1.5 pt-1">
                      <MessageSquare className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-300">Investigation Note:</strong> {anomaly.notes}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Metrics & Action Buttons */}
                <div className="lg:w-64 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                  {/* Variance numbers */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Observed Load:</span>
                      <span className="font-mono font-bold text-rose-400 tabular-nums">{anomaly.observedKwh} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expected Baseline:</span>
                      <span className="font-mono text-slate-300 tabular-nums">{anomaly.expectedKwh} kWh</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-850">
                      <span className="text-slate-400 font-medium">Variance:</span>
                      <span className="font-mono font-bold text-amber-400">+{anomaly.differencePercentage}%</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    {anomaly.status === 'Detected' && (
                      <button
                        onClick={() => handleOpenActionModal(anomaly, 'acknowledge')}
                        className="w-full rounded-lg border border-cyan-500/40 bg-cyan-950/40 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 transition-colors"
                      >
                        Acknowledge & Add Note
                      </button>
                    )}

                    {anomaly.status !== 'Resolved' && (
                      <button
                        onClick={() => handleOpenActionModal(anomaly, 'resolve')}
                        className="w-full rounded-lg bg-emerald-600/90 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                      >
                        Mark as Resolved
                      </button>
                    )}

                    {anomaly.status === 'Resolved' && (
                      <div className="text-center text-xs font-medium text-emerald-400 flex items-center justify-center gap-1.5 py-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Resolved on {new Date(anomaly.resolvedAt || '').toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Notes Modal */}
      {activeModalAnomaly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white capitalize">
                {modalAction} Anomaly: {activeModalAnomaly.buildingName}
              </h3>
              <button
                onClick={() => setActiveModalAnomaly(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide findings or remediation steps taken (e.g., thermostat set back, valve replaced, BMS schedule
              locked):
            </p>

            <textarea
              rows={4}
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Enter corrective action details..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModalAnomaly(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmModalAction}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-400 transition-colors"
              >
                Confirm {modalAction === 'acknowledge' ? 'Acknowledgment' : 'Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
