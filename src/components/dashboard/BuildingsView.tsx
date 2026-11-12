import React, { useState, useMemo } from 'react';
import {
  Building as BuildingIcon,
  Plus,
  Edit2,
  Trash2,
  Cpu,
  Layers,
  TrendingDown,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { Building } from '../../types/energy';
import { formatKwh, formatInr } from '../../utils/energyMath';

export const BuildingsView: React.FC = () => {
  const { currentOrg, buildings, devices, readings, addBuilding, updateBuilding, deleteBuilding } =
    useEnergy();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Academic / Classroom');
  const [formAreaSqFt, setFormAreaSqFt] = useState(30000);
  const [formBaselineDaily, setFormBaselineDaily] = useState(250);
  const [formStatus, setFormStatus] = useState<'Active' | 'Under Maintenance'>('Active');
  const [formNotes, setFormNotes] = useState('');

  const orgBuildings = useMemo(() => {
    return buildings.filter((b) => b.organizationId === currentOrg.id);
  }, [buildings, currentOrg.id]);

  const buildingStats = useMemo(() => {
    return orgBuildings.map((b) => {
      const bReadings = readings.filter((r) => r.buildingId === b.id);
      const totalKwh = bReadings.reduce((sum, r) => sum + r.consumptionKwh, 0);
      const bDevices = devices.filter((d) => d.buildingId === b.id);
      const eui = b.areaSqFt > 0 ? (totalKwh / b.areaSqFt).toFixed(2) : '0.00';

      return {
        ...b,
        actualTotalKwh: Math.round(totalKwh * 10) / 10,
        assignedDevices: bDevices,
        eui,
      };
    });
  }, [orgBuildings, readings, devices]);

  const handleOpenAdd = () => {
    setEditingBuilding(null);
    setFormName('');
    setFormType('Academic / Classroom');
    setFormAreaSqFt(35000);
    setFormBaselineDaily(280);
    setFormStatus('Active');
    setFormNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Building) => {
    setEditingBuilding(b);
    setFormName(b.name);
    setFormType(b.type);
    setFormAreaSqFt(b.areaSqFt);
    setFormBaselineDaily(b.baselineKwhDaily);
    setFormStatus(b.status);
    setFormNotes(b.notes || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingBuilding) {
      updateBuilding(editingBuilding.id, {
        name: formName,
        type: formType,
        areaSqFt: Number(formAreaSqFt),
        baselineKwhDaily: Number(formBaselineDaily),
        status: formStatus,
        notes: formNotes,
      });
    } else {
      addBuilding({
        organizationId: currentOrg.id,
        name: formName,
        type: formType,
        areaSqFt: Number(formAreaSqFt),
        baselineKwhDaily: Number(formBaselineDaily),
        status: formStatus,
        notes: formNotes,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? All associated meter mappings will be removed.`)) {
      deleteBuilding(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BuildingIcon className="h-6 w-6 text-indigo-400" />
            Campus Facility & Building Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hierarchical facility structures, baseline kilowatt thresholds, and sub-meter allocations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Building</span>
        </button>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildingStats.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">{b.name}</h3>
                  <p className="text-xs text-slate-400">{b.type}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    title="Edit Building"
                    className="p-1.5 text-slate-400 hover:text-cyan-400"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.name)}
                    title="Delete Building"
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Status and Rating */}
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    b.status === 'Active'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {b.status}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300 font-mono text-[11px]">
                  Efficiency Rating:{' '}
                  <strong
                    className={
                      b.efficiencyScore >= 88 ? 'text-emerald-400' : 'text-cyan-400'
                    }
                  >
                    {b.efficiencyScore}%
                  </strong>
                </span>
              </div>

              {b.notes && <p className="text-xs text-slate-400 italic line-clamp-2">{b.notes}</p>}

              {/* Facility Metrics Strip */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Floor Area</span>
                  <span className="font-mono text-slate-200">{b.areaSqFt.toLocaleString()} sq ft</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Baseline Target</span>
                  <span className="font-mono text-slate-200">{b.baselineKwhDaily} kWh / day</span>
                </div>
                <div className="pt-1 border-t border-slate-850">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Consumption</span>
                  <span className="font-mono text-cyan-300 font-semibold">{formatKwh(b.actualTotalKwh)}</span>
                </div>
                <div className="pt-1 border-t border-slate-850">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">EUI Intensity</span>
                  <span className="font-mono text-indigo-300 font-semibold">{b.eui} kWh/sqft</span>
                </div>
              </div>
            </div>

            {/* Assigned Devices List */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Cpu className="h-3 w-3 text-cyan-400" />
                Assigned Equipment ({b.assignedDevices.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {b.assignedDevices.length === 0 ? (
                  <span className="text-[11px] text-slate-500 italic">No devices assigned yet.</span>
                ) : (
                  b.assignedDevices.map((dev) => (
                    <span
                      key={dev.id}
                      className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300 font-medium"
                    >
                      {dev.name}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingBuilding ? 'Edit Building Specification' : 'Add New Campus Facility'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Building Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Science & Innovation Complex"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Function</label>
                  <input
                    type="text"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    placeholder="e.g. Laboratories"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Floor Area (Sq. Ft.)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formAreaSqFt}
                    onChange={(e) => setFormAreaSqFt(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Baseline kWh / Day</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formBaselineDaily}
                    onChange={(e) => setFormBaselineDaily(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Operational Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Key electrical distribution boards, HVAC zones..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
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
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  {editingBuilding ? 'Update Facility' : 'Save Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
