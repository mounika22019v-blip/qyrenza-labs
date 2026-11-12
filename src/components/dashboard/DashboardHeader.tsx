import React, { useState } from 'react';
import {
  Zap,
  Bell,
  ChevronDown,
  Building,
  User,
  LogOut,
  RotateCcw,
  AlertTriangle,
  Radio,
  Sliders,
  ExternalLink,
  Activity,
  BarChart3,
  Lightbulb,
  Cpu,
  FileSpreadsheet,
  Layers,
  Menu,
  X,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

interface DashboardHeaderProps {
  activeView: string;
  onOpenMeterModal: () => void;
  onNavigateHome: () => void;
  onToggleMobileSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeView,
  onOpenMeterModal,
  onNavigateHome,
  onToggleMobileSidebar,
}) => {
  const {
    user,
    logout,
    currentOrg,
    organizations,
    setCurrentOrgId,
    anomalies,
    isDemoMode,
    resetDemoData,
  } = useEnergy();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const activeAnomalies = anomalies.filter((a) => a.status === 'Detected');

  const viewTitles: Record<string, string> = {
    overview: 'Campus Energy Overview',
    monitoring: 'Live & Historical Energy Monitoring',
    analytics: 'Energy Intelligence Analytics',
    anomalies: 'Rule-Based Anomaly Detection',
    recommendations: 'Smart Efficiency Recommendations',
    devices: 'Device & Meter Asset Inventory',
    buildings: 'Campus Facility & Building Management',
    reports: 'Energy Audit Reports & Exports',
    organizations: 'Multi-Tenant Organizations',
    settings: 'System & Tariff Configuration',
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#090e1c]/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Hamburger (mobile) + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation sidebar"
          className="md:hidden p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <button onClick={onNavigateHome} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Qyrenza Labs</span>
          </button>
          <span>/</span>
          <span className="text-slate-200 font-medium">{viewTitles[activeView] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Demo Mode Badge with Reset */}
        {isDemoMode && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-950/40 px-2.5 py-1 text-xs text-amber-300">
            <span className="font-semibold text-[10px] uppercase tracking-wider">DEMO MODE</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo records back to baseline state?')) {
                  resetDemoData();
                }
              }}
              title="Reset Demo Data"
              className="flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] hover:bg-amber-500/30 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Data
            </button>
          </div>
        )}

        {/* Real Meter Ingestion Simulator Trigger */}
        <button
          onClick={onOpenMeterModal}
          className="hidden md:flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/40 transition-colors"
        >
          <Radio className="h-3.5 w-3.5 text-cyan-400" />
          <span>Meter Gateway API</span>
        </button>

        {/* Organization Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors"
          >
            <Building className="h-3.5 w-3.5 text-indigo-400" />
            <span className="max-w-[130px] truncate">{currentOrg.name}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {orgDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-xl z-50">
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Select Organization
              </span>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setCurrentOrgId(org.id);
                    setOrgDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                    org.id === currentOrg.id
                      ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{org.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">₹{org.electricityTariff}/kWh</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell (Real Active Anomaly alerts) */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="View notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="h-4 w-4" />
            {activeAnomalies.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {activeAnomalies.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">Active Anomaly Alerts</span>
                <span className="font-mono text-[10px] text-rose-400">{activeAnomalies.length} Unresolved</span>
              </div>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {activeAnomalies.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400">All power anomalies resolved.</p>
                ) : (
                  activeAnomalies.map((a) => (
                    <div key={a.id} className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-rose-300">{a.buildingName}</span>
                        <span className="text-[10px] text-slate-400">{new Date(a.detectionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">{a.explanation}</p>
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-cyan-300">
                        <span>Observed: {a.observedKwh} kWh</span>
                        <span>(Expected: {a.expectedKwh} kWh)</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-800 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="font-semibold text-slate-200 leading-tight truncate max-w-[100px]">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{user?.role || 'admin'}</div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="font-semibold text-xs text-white truncate">{user?.name}</div>
                <div className="text-[10px] text-slate-400 truncate font-mono">{user?.email}</div>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigateHome();
                }}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
                <span>Public Website</span>
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                  onNavigateHome();
                }}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

interface DashboardSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onNavigateHome: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeView,
  setActiveView,
  onNavigateHome,
  collapsed,
  setCollapsed,
  mobileOpen,
  onCloseMobile,
}) => {
  const { anomalies } = useEnergy();
  const activeAnomalyCount = anomalies.filter((a) => a.status === 'Detected').length;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Zap },
    { id: 'monitoring', label: 'Energy Monitoring', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle, badge: activeAnomalyCount },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'devices', label: 'Devices', icon: Cpu },
    { id: 'buildings', label: 'Buildings', icon: Building },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'organizations', label: 'Organizations', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800 bg-[#060913] transition-transform duration-300 md:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-left cursor-pointer overflow-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="whitespace-nowrap">
                <div className="text-sm font-extrabold tracking-wider text-white">QYRENZA LABS</div>
                <div className="text-[10px] text-cyan-400 font-medium">Energy Intelligence</div>
              </div>
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Menu Items */}
        <nav className="flex-1 space-y-1 p-2.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Toggle */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center rounded-lg bg-slate-900 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? '→' : '← Collapse Sidebar'}
          </button>
        </div>
      </aside>
    </>
  );
};
