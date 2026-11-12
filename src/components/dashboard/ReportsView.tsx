import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Building,
  Plus,
  Eye,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { EnergyReport, ReportType } from '../../types/energy';
import { generateCsvContent, downloadCsvFile, formatInr, formatKwh } from '../../utils/energyMath';

export const ReportsView: React.FC = () => {
  const { currentOrg, reports, buildings, generateReport } = useEnergy();

  const [activeReport, setActiveReport] = useState<EnergyReport | null>(reports[0] || null);

  // Generate new report modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<ReportType>('Monthly');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');

  const orgReports = useMemo(() => {
    return reports.filter((r) => r.organizationId === currentOrg.id);
  }, [reports, currentOrg.id]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const created = generateReport(
      reportTitle.trim(),
      reportType,
      `${startDate}T00:00:00Z`,
      `${endDate}T23:59:59Z`
    );
    setActiveReport(created);
    setModalOpen(false);
  };

  const handleDownloadCsv = (rep: EnergyReport) => {
    const rows = [
      ...rep.buildingBreakdown.map((b) => ({
        ReportTitle: rep.title,
        Section: 'Building Breakdown',
        Entity: b.buildingName,
        Consumption_kWh: b.consumptionKwh,
        Cost_INR: b.costInr,
      })),
      ...rep.equipmentBreakdown.map((eq) => ({
        ReportTitle: rep.title,
        Section: 'Equipment Category',
        Entity: eq.category,
        Consumption_kWh: eq.consumptionKwh,
        Cost_INR: eq.costInr,
      })),
    ];
    const csv = generateCsvContent(rows);
    downloadCsvFile(csv, `${rep.title.replace(/\s+/g, '_')}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Generation Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
            Energy Audit Reports & Compliance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compile executive summaries, equipment distributions, tariff allocations, and print/PDF audits.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-opacity self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Generate New Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Report History List */}
        <div className="no-print space-y-3">
          <h3 className="text-sm font-semibold text-white">Generated Reports ({orgReports.length})</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {orgReports.map((rep) => {
              const isSelected = activeReport?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setActiveReport(rep)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500/50 bg-cyan-950/20 shadow-md'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {rep.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(rep.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="mt-2 text-xs font-semibold text-white truncate">{rep.title}</h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-cyan-300">{formatKwh(rep.totalKwh)}</span>
                    <span className="font-mono text-emerald-400">{formatInr(rep.totalCostInr)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Report Preview & Actions */}
        <div className="lg:col-span-2 space-y-4">
          {activeReport ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl print-card">
              {/* Report Header Actions (Hidden in print) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800 no-print">
                <span className="text-xs font-mono text-cyan-400">Report ID: {activeReport.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadCsv(activeReport)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Download CSV</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>

              {/* Printable Body */}
              <div className="mt-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>QYRENZA LABS ENERGY INTELLIGENCE REPORT</span>
                    <span className="font-mono">Tariff Rate: ₹{currentOrg.electricityTariff}/kWh</span>
                  </div>
                  <h1 className="mt-2 text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {activeReport.title}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Audited Period:{' '}
                    <span className="text-slate-200 font-mono">
                      {new Date(activeReport.periodStart).toLocaleDateString()} —{' '}
                      {new Date(activeReport.periodEnd).toLocaleDateString()}
                    </span>{' '}
                    | Facility: {currentOrg.name}
                  </p>
                </div>

                {/* Primary Metrics Summary */}
                <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Consumption</span>
                    <span className="font-mono text-lg font-bold text-white tabular-nums">
                      {formatKwh(activeReport.totalKwh)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Billed Cost</span>
                    <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                      {formatInr(activeReport.totalCostInr)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Conservation Savings</span>
                    <span className="font-mono text-lg font-bold text-cyan-400 tabular-nums">
                      {formatKwh(activeReport.totalSavedKwh)}
                    </span>
                  </div>
                </div>

                {/* Building Breakdown Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Facility Breakdown (kWh & Cost)
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400">
                        <tr>
                          <th className="py-2.5 px-3">Building Name</th>
                          <th className="py-2.5 px-3 text-right">Consumption (kWh)</th>
                          <th className="py-2.5 px-3 text-right">Expenditure (₹)</th>
                          <th className="py-2.5 px-3 text-right">Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {activeReport.buildingBreakdown.map((b, i) => {
                          const pct =
                            activeReport.totalKwh > 0
                              ? Math.round((b.consumptionKwh / activeReport.totalKwh) * 100)
                              : 0;
                          return (
                            <tr key={i}>
                              <td className="py-2 px-3 font-medium text-white">{b.buildingName}</td>
                              <td className="py-2 px-3 text-right font-mono text-cyan-300">
                                {formatKwh(b.consumptionKwh)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-emerald-300">
                                {formatInr(b.costInr)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-slate-400">{pct}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Equipment Distribution Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Equipment Category Distribution
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400">
                        <tr>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3 text-right">Consumption (kWh)</th>
                          <th className="py-2.5 px-3 text-right">Cost (₹)</th>
                          <th className="py-2.5 px-3 text-right">Load Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {activeReport.equipmentBreakdown.map((eq, i) => {
                          const pct =
                            activeReport.totalKwh > 0
                              ? Math.round((eq.consumptionKwh / activeReport.totalKwh) * 100)
                              : 0;
                          return (
                            <tr key={i}>
                              <td className="py-2 px-3 font-medium text-white">{eq.category}</td>
                              <td className="py-2 px-3 text-right font-mono text-cyan-300">
                                {formatKwh(eq.consumptionKwh)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-emerald-300">
                                {formatInr(eq.costInr)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-slate-400">{pct}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Audit Signature Block */}
                <div className="pt-6 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                  <div>
                    <span>Generated By: {currentOrg.adminName}</span>
                    <p className="text-[10px] text-slate-500 font-mono">Qyrenza Labs Certified Energy Audit</p>
                  </div>
                  <div className="text-right">
                    <span>Contact: n7282433@gmail.com</span>
                    <p className="text-[10px] text-slate-500">© 2026 Qyrenza Labs</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 text-sm">
              Select or generate an energy report.
            </div>
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Generate Energy Audit Report</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. November Mid-Term Campus Power Audit"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Daily">Daily Energy Report</option>
                  <option value="Weekly">Weekly Executive Brief</option>
                  <option value="Monthly">Monthly Comprehensive Audit</option>
                  <option value="Building Comparison">Building Comparison Report</option>
                  <option value="Equipment">Equipment Consumption Report</option>
                  <option value="Savings">Savings & Efficiency Report</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                >
                  Compile & Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
