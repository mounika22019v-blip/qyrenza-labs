import React, { useState } from 'react';
import { DashboardHeader, DashboardSidebar } from './DashboardHeader';
import { OverviewView } from './OverviewView';
import { MonitoringView } from './MonitoringView';
import { AnalyticsView } from './AnalyticsView';
import { AnomaliesView } from './AnomaliesView';
import { RecommendationsView } from './RecommendationsView';
import { DevicesView } from './DevicesView';
import { BuildingsView } from './BuildingsView';
import { ReportsView } from './ReportsView';
import { OrganizationsView } from './OrganizationsView';
import { SettingsView } from './SettingsView';
import { MeterIntegrationModal } from './MeterIntegrationModal';

interface DashboardLayoutProps {
  onNavigateHome: () => void;
  initialView?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onNavigateHome,
  initialView = 'overview',
}) => {
  const [activeView, setActiveView] = useState(initialView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [meterModalOpen, setMeterModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060913] text-slate-100">
      {/* Sidebar */}
      <DashboardSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onNavigateHome={onNavigateHome}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          activeView={activeView}
          onOpenMeterModal={() => setMeterModalOpen(true)}
          onNavigateHome={onNavigateHome}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {activeView === 'overview' && <OverviewView onNavigateToView={setActiveView} />}
            {activeView === 'monitoring' && <MonitoringView />}
            {activeView === 'analytics' && <AnalyticsView />}
            {activeView === 'anomalies' && <AnomaliesView />}
            {activeView === 'recommendations' && <RecommendationsView />}
            {activeView === 'devices' && <DevicesView onOpenMeterModal={() => setMeterModalOpen(true)} />}
            {activeView === 'buildings' && <BuildingsView />}
            {activeView === 'reports' && <ReportsView />}
            {activeView === 'organizations' && <OrganizationsView />}
            {activeView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Hardware / IoT Meter Integration Modal */}
      <MeterIntegrationModal
        isOpen={meterModalOpen}
        onClose={() => setMeterModalOpen(false)}
      />
    </div>
  );
};
