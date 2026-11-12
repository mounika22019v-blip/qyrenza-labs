import React, { useState } from 'react';
import {
  Sliders,
  User,
  Shield,
  Coins,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

export const SettingsView: React.FC = () => {
  const { user, currentOrg, settings, updateSettings, updateUserProfile, updateOrganization, resetDemoData } =
    useEnergy();

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');

  const [tariff, setTariff] = useState(currentOrg.electricityTariff);
  const [peakMultiplier, setPeakMultiplier] = useState(currentOrg.peakTariffMultiplier);

  const [emailAlerts, setEmailAlerts] = useState(settings.emailAlerts);
  const [sensitivity, setSensitivity] = useState(settings.anomalySensitivity);
  const [nightThreshold, setNightThreshold] = useState(settings.nightAlertThresholdKwh);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    // Update user profile
    updateUserProfile({
      name: profileName,
      email: profileEmail,
    });

    // Update active org tariff
    updateOrganization(currentOrg.id, {
      electricityTariff: Number(tariff),
      peakTariffMultiplier: Number(peakMultiplier),
    });

    // Update settings
    updateSettings({
      electricityTariff: Number(tariff),
      peakMultiplier: Number(peakMultiplier),
      emailAlerts,
      anomalySensitivity: sensitivity,
      nightAlertThresholdKwh: Number(nightThreshold),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sliders className="h-6 w-6 text-cyan-400" />
          Settings & Account Preferences
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure electricity billing tariffs, notification thresholds, anomaly sensitivities, and profile credentials.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Configuration saved and persisted to local session.</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            User Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>
              Role: <strong className="text-cyan-300 capitalize">{user?.role || 'admin'}</strong>
            </span>
            <span>·</span>
            <span>
              Organization: <strong className="text-white">{currentOrg.name}</strong>
            </span>
          </div>
        </div>

        {/* Electricity Tariff & Pricing Configuration */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Coins className="h-4 w-4 text-emerald-400" />
            Electricity Tariff & Utility Rates
          </h3>
          <p className="text-xs text-slate-400">
            Calculates cost projections, anomaly variances, and estimated savings across the platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Base Electricity Tariff (₹ / kWh)</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                required
                value={tariff}
                onChange={(e) => setTariff(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default state commercial tariff: ₹8.50/kWh</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Peak Surcharge Multiplier</label>
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="3.0"
                required
                value={peakMultiplier}
                onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Peak window (09:00 - 18:00) rate: ₹{(tariff * peakMultiplier).toFixed(2)}/kWh
              </span>
            </div>
          </div>
        </div>

        {/* Alerts & Detection Sensitivities */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-400" />
            Anomaly & Alert Preferences
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Email Telemetry Alerts</span>
                <span className="text-[11px] text-slate-400">
                  Notify designated facility administrators upon high-severity consumption breaches.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Anomaly Sensitivity</label>
                <select
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Low">Low (Flag only &gt; 60% surges)</option>
                  <option value="Medium">Medium (Flag &gt; 40% surges)</option>
                  <option value="High">High (Flag &gt; 25% surges)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Night Alert Threshold (kWh)</label>
                <input
                  type="number"
                  min="5"
                  value={nightThreshold}
                  onChange={(e) => setNightThreshold(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo campus records?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Records</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
