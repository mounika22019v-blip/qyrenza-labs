import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X,
  MapPin,
  Coins,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { Organization, OrgType } from '../../types/energy';

export const OrganizationsView: React.FC = () => {
  const { organizations, currentOrg, setCurrentOrgId, createOrganization, updateOrganization } =
    useEnergy();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<OrgType>('Educational Institution');
  const [formLocation, setFormLocation] = useState('');
  const [formTariff, setFormTariff] = useState(8.5);
  const [formPeakMultiplier, setFormPeakMultiplier] = useState(1.25);
  const [formAdminName, setFormAdminName] = useState('');
  const [formAdminEmail, setFormAdminEmail] = useState('');

  const handleOpenAdd = () => {
    setEditingOrg(null);
    setFormName('');
    setFormType('Educational Institution');
    setFormLocation('Hyderabad, Telangana');
    setFormTariff(8.5);
    setFormPeakMultiplier(1.25);
    setFormAdminName('Nama Mounika');
    setFormAdminEmail('n7282433@gmail.com');
    setModalOpen(true);
  };

  const handleOpenEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormName(org.name);
    setFormType(org.type);
    setFormLocation(org.location);
    setFormTariff(org.electricityTariff);
    setFormPeakMultiplier(org.peakTariffMultiplier);
    setFormAdminName(org.adminName);
    setFormAdminEmail(org.adminEmail);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingOrg) {
      updateOrganization(editingOrg.id, {
        name: formName,
        type: formType,
        location: formLocation,
        electricityTariff: Number(formTariff),
        peakTariffMultiplier: Number(formPeakMultiplier),
        adminName: formAdminName,
        adminEmail: formAdminEmail,
      });
    } else {
      createOrganization({
        name: formName,
        type: formType,
        location: formLocation,
        electricityTariff: Number(formTariff),
        peakTariffMultiplier: Number(formPeakMultiplier),
        currency: '₹',
        buildingCount: 0,
        adminName: formAdminName,
        adminEmail: formAdminEmail,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-400" />
            Multi-Tenant Organization Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict tenant data isolation, custom tariff structures, and campus administrative boundaries.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-opacity self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Organization</span>
        </button>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {organizations.map((org) => {
          const isActive = org.id === currentOrg.id;
          return (
            <div
              key={org.id}
              className={`rounded-2xl border p-6 backdrop-blur-sm transition-all ${
                isActive
                  ? 'border-cyan-500/60 bg-gradient-to-b from-cyan-950/20 to-slate-900/90 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{org.name}</h3>
                    {isActive && (
                      <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                        ACTIVE WORKSPACE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{org.type}</p>
                </div>

                <button
                  onClick={() => handleOpenEdit(org)}
                  title="Edit Organization"
                  className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{org.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-3.5 w-3.5 text-emerald-400" />
                  <span>
                    Tariff: <strong className="font-mono text-white">₹{org.electricityTariff.toFixed(2)} / kWh</strong>{' '}
                    (Peak: {org.peakTariffMultiplier}x)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{org.buildingCount} Buildings in Fleet</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Admin: {org.adminName}
                </span>

                {isActive ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Selected Workspace</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentOrgId(org.id)}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <span>Switch to this Org</span>
                    <ArrowRight className="h-3 w-3 text-cyan-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Org Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingOrg ? 'Edit Organization' : 'Create Organization Workspace'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Hyderabad Innovation Campus"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organization Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Educational Institution">Educational Institution</option>
                  <option value="Commercial Office">Commercial Office</option>
                  <option value="Hostel">Hostel / Dormitory</option>
                  <option value="Small Business">Small Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Campus Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. HITEC City, Hyderabad"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Base Tariff (₹ / kWh)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1"
                    required
                    value={formTariff}
                    onChange={(e) => setFormTariff(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Peak Surcharge (x)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1"
                    required
                    value={formPeakMultiplier}
                    onChange={(e) => setFormPeakMultiplier(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Administrator Name</label>
                  <input
                    type="text"
                    required
                    value={formAdminName}
                    onChange={(e) => setFormAdminName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={formAdminEmail}
                    onChange={(e) => setFormAdminEmail(e.target.value)}
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
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-400 transition-colors"
                >
                  {editingOrg ? 'Update Organization' : 'Provision Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
