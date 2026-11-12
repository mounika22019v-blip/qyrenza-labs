import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Download,
  AlertCircle,
  Building,
  CheckCircle2,
  X,
  Radio,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { Device, DeviceCategory, DeviceStatus } from '../../types/energy';
import { generateCsvContent, downloadCsvFile, formatKwh } from '../../utils/energyMath';

export const DevicesView: React.FC<{ onOpenMeterModal: () => void }> = ({ onOpenMeterModal }) => {
  const { currentOrg, buildings, devices, addDevice, updateDevice, deleteDevice } = useEnergy();

  const [categoryFilter, setCategoryFilter] = useState<'All' | DeviceCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | DeviceStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<DeviceCategory>('HVAC');
  const [formBuildingId, setFormBuildingId] = useState('');
  const [formCapacityKw, setFormCapacityKw] = useState(15);
  const [formStatus, setFormStatus] = useState<DeviceStatus>('Connected');
  const [formLocation, setFormLocation] = useState('');

  const orgDevices = useMemo(() => {
    return devices.filter((d) => d.organizationId === currentOrg.id);
  }, [devices, currentOrg.id]);

  const filtered = useMemo(() => {
    return orgDevices.filter((d) => {
      if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && d.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orgDevices, categoryFilter, statusFilter, searchQuery]);

  const handleOpenAdd = () => {
    setEditingDevice(null);
    setFormName('');
    setFormCategory('HVAC');
    setFormBuildingId(buildings[0]?.id || '');
    setFormCapacityKw(15);
    setFormStatus('Connected');
    setFormLocation('Main Electrical Room');
    setModalOpen(true);
  };

  const handleOpenEdit = (dev: Device) => {
    setEditingDevice(dev);
    setFormName(dev.name);
    setFormCategory(dev.category);
    setFormBuildingId(dev.buildingId);
    setFormCapacityKw(dev.capacityKw);
    setFormStatus(dev.status);
    setFormLocation(dev.location);
    setModalOpen(true);
  };

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingDevice) {
      updateDevice(editingDevice.id, {
        name: formName,
        category: formCategory,
        buildingId: formBuildingId,
        capacityKw: Number(formCapacityKw),
        status: formStatus,
        location: formLocation,
      });
    } else {
      addDevice({
        organizationId: currentOrg.id,
        buildingId: formBuildingId,
        name: formName,
        category: formCategory,
        capacityKw: Number(formCapacityKw),
        status: formStatus,
        location: formLocation,
        installDate: new Date().toISOString().split('T')[0],
      });
    }
    setModalOpen(false);
  };

  const handleDeleteDevice = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from this facility?`)) {
      deleteDevice(id);
    }
  };

  const handleExportCsv = () => {
    const csvRows = filtered.map((d) => {
      const b = buildings.find((x) => x.id === d.buildingId);
      return {
        DeviceID: d.id,
        DeviceName: d.name,
        Category: d.category,
        Building: b?.name || d.buildingId,
        Location: d.location,
        Capacity_kW: d.capacityKw,
        Status: d.status,
        LastReading_kWh: d.lastReadingKwh,
        InstallDate: d.installDate,
      };
    });
    const csv = generateCsvContent(csvRows);
    downloadCsvFile(csv, `Qyrenza_Device_Inventory_${currentOrg.name.replace(/\s+/g, '_')}.csv`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            Device & Meter Asset Inventory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage sub-meters, smart circuit breakers, HVAC sensors, and energy consumers across campus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMeterModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Radio className="h-3.5 w-3.5 text-cyan-400" />
            <span>Hardware Gateway API</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span>Add Device</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {(['HVAC', 'Lighting', 'Computers', 'Pumps', 'Laboratory Equipment', 'Other'] as DeviceCategory[]).map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Connected">Connected</option>
              <option value="Offline">Offline</option>
              <option value="Demo Device">Demo Device</option>
            </select>
          </div>
        </div>

        {/* Search & Export */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none w-48 sm:w-64"
          />
          <button
            onClick={handleExportCsv}
            title="Download CSV Inventory"
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Devices Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Device Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Assigned Building</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold text-right">Rated Capacity</th>
                <th className="py-3 px-4 font-semibold text-right">Last Draw</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No devices match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => {
                  const b = buildings.find((x) => x.id === d.buildingId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{d.name}</td>
                      <td className="py-3 px-4 text-slate-300">{d.category}</td>
                      <td className="py-3 px-4 text-cyan-300">{b?.name || 'Unassigned'}</td>
                      <td className="py-3 px-4 text-slate-400">{d.location}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">{d.capacityKw} kW</td>
                      <td className="py-3 px-4 text-right font-mono text-cyan-400 font-medium">
                        {formatKwh(d.lastReadingKwh)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                            d.status === 'Connected'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : d.status === 'Offline'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(d)}
                            title="Edit Device"
                            className="p-1 text-slate-400 hover:text-cyan-400"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDevice(d.id, d.name)}
                            title="Delete Device"
                            className="p-1 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Device Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingDevice ? 'Edit Device Configuration' : 'Register New Device / Meter'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Device / Sub-Meter Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Cleanroom HVAC Chiller 2"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Computers">Computers</option>
                    <option value="Pumps">Pumps</option>
                    <option value="Laboratory Equipment">Laboratory Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Building</label>
                  <select
                    value={formBuildingId}
                    onChange={(e) => setFormBuildingId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {buildings
                      .filter((b) => b.organizationId === currentOrg.id)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Rated Capacity (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formCapacityKw}
                    onChange={(e) => setFormCapacityKw(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Connection Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Connected">Connected</option>
                    <option value="Offline">Offline</option>
                    <option value="Demo Device">Demo Device</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Specific Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Ground Floor Electrical Distribution Panel 4"
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
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-400 transition-colors"
                >
                  {editingDevice ? 'Update Device' : 'Register Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
