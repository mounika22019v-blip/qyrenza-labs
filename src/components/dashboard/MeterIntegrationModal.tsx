import React, { useState } from 'react';
import {
  X,
  Radio,
  Wifi,
  Server,
  Terminal,
  Code2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Send,
  Zap,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

interface MeterIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeterIntegrationModal: React.FC<MeterIntegrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentOrg, buildings, devices, ingestReading } = useEnergy();

  const [activeTab, setActiveTab] = useState<'rest' | 'mqtt' | 'modbus' | 'simulator'>('rest');
  const [copied, setCopied] = useState(false);

  // Ingestion Simulator states
  const [simBuildingId, setSimBuildingId] = useState(buildings[0]?.id || '');
  const [simDeviceId, setSimDeviceId] = useState(devices[0]?.id || '');
  const [simKwh, setSimKwh] = useState('24.5');
  const [simDataSource, setSimDataSource] = useState<'Connected Meter' | 'Imported' | 'Simulated'>(
    'Connected Meter'
  );
  const [simStatus, setSimStatus] = useState<'idle' | 'success'>('idle');

  if (!isOpen) return null;

  const sampleRestPayload = JSON.stringify(
    {
      organization_id: currentOrg.id,
      meter_hardware_id: 'QYR-GW-8472-A',
      building_id: simBuildingId || 'b-acad',
      device_id: simDeviceId || 'dev-1',
      timestamp: new Date().toISOString(),
      active_power_kw: 18.4,
      total_active_kwh: 1240.8,
      interval_consumption_kwh: 24.5,
      voltage_l1_v: 231.2,
      voltage_l2_v: 230.8,
      voltage_l3_v: 231.5,
      power_factor: 0.96,
      frequency_hz: 50.02,
      data_source: 'Connected Meter',
    },
    null,
    2
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePing = (e: React.FormEvent) => {
    e.preventDefault();
    const kwh = parseFloat(simKwh) || 15.0;
    const isPeak = new Date().getHours() >= 9 && new Date().getHours() <= 18;
    const cost = kwh * currentOrg.electricityTariff * (isPeak ? currentOrg.peakTariffMultiplier : 1.0);

    ingestReading({
      organizationId: currentOrg.id,
      buildingId: simBuildingId,
      deviceId: simDeviceId,
      timestamp: new Date().toISOString(),
      consumptionKwh: kwh,
      costInr: Math.round(cost * 100) / 100,
      isPeak,
      isAnomaly: kwh > 50,
      dataSource: simDataSource,
    });

    setSimStatus('success');
    setTimeout(() => setSimStatus('idle'), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Physical Meter & IoT Integration</h3>
              <p className="text-[11px] text-slate-400">
                Protocols for Smart Meters, Modbus TCP gateways, and MQTT field bridges.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mandatory Transparency Notice */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3 text-xs text-cyan-200 leading-relaxed flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
          <div>
            <strong className="text-white">HARDWARE CLASSIFICATION DISCLOSURE:</strong> In accordance with engineering
            standards, the platform tags all telemetry explicitly as{' '}
            <span className="font-mono text-cyan-300 font-bold">"Connected Meter"</span> (physical hardware online),{' '}
            <span className="font-mono text-emerald-300 font-bold">"Imported"</span> (CSV / billing feeds), or{' '}
            <span className="font-mono text-amber-300 font-bold">"Simulated"</span> (demo sandbox data).
          </div>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="flex border-b border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('rest')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'rest'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            REST Ingestion API
          </button>
          <button
            onClick={() => setActiveTab('mqtt')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'mqtt'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            MQTT Broker
          </button>
          <button
            onClick={() => setActiveTab('modbus')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'modbus'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Modbus TCP / RTU Gateway
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'simulator'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Ingestion Simulator
          </button>
        </div>

        {/* Tab 1: REST API */}
        {activeTab === 'rest' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Endpoint URL & Authorization:</span>
              <button
                onClick={() => handleCopy(sampleRestPayload)}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                <Copy className="h-3 w-3" />
                <span>{copied ? 'Copied Payload!' : 'Copy Schema'}</span>
              </button>
            </div>

            <div className="rounded-lg border border-slate-850 bg-slate-950 p-2.5 font-mono text-[11px] text-slate-300">
              <span className="text-cyan-400 font-bold">POST</span> /api/v1/telemetry/ingest
              <div className="text-slate-500 text-[10px] mt-0.5">Authorization: Bearer qyr_sec_live_94f83b2...</div>
            </div>

            <pre className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-56">
              {sampleRestPayload}
            </pre>
          </div>
        )}

        {/* Tab 2: MQTT Broker */}
        {activeTab === 'mqtt' && (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              Connect edge smart meters (e.g., Schneider Electric PowerLogic, Selec MFM, or custom ESP32/Nordic nodes)
              via secure TLS MQTT:
            </p>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2 font-mono text-[11px]">
              <div>
                <span className="text-slate-500">Broker: </span>
                <span className="text-cyan-300">mqtt.telemetry.qyrenza.io:8883 (MQTTS)</span>
              </div>
              <div>
                <span className="text-slate-500">Topic: </span>
                <span className="text-indigo-300">qyrenza/v1/{currentOrg.id}/meter/{"{deviceId}"}</span>
              </div>
              <div>
                <span className="text-slate-500">QoS Level: </span>
                <span className="text-emerald-400">QoS 1 (At least once delivery)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Modbus Gateway */}
        {activeTab === 'modbus' && (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              Standard RS-485 Modbus RTU loops connect through an on-premise IP gateway (Moxa MGate or Advantech)
              polling standard 16-bit registers:
            </p>
            <div className="rounded-lg border border-slate-850 bg-slate-950 p-3 font-mono text-[11px] space-y-1">
              <div>Register 30001: Active Power kW (Float32)</div>
              <div>Register 30003: Cumulative Energy kWh (Float32)</div>
              <div>Register 30005: Line Voltage V (Float32)</div>
              <div>Register 30007: Power Factor (Float32)</div>
            </div>
          </div>
        )}

        {/* Tab 4: Live Ingestion Simulator */}
        {activeTab === 'simulator' && (
          <form onSubmit={handleSimulatePing} className="space-y-4 text-xs">
            <p className="text-slate-300">
              Transmit a live simulated meter telemetry packet directly into this session to verify dashboard real-time
              responsiveness:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Target Facility</label>
                <select
                  value={simBuildingId}
                  onChange={(e) => setSimBuildingId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
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

              <div>
                <label className="block text-slate-400 mb-1">Target Device / Meter</label>
                <select
                  value={simDeviceId}
                  onChange={(e) => setSimDeviceId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                >
                  {devices
                    .filter((d) => d.organizationId === currentOrg.id)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.category})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Interval Consumption (kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={simKwh}
                  onChange={(e) => setSimKwh(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hardware Classification Tag</label>
                <select
                  value={simDataSource}
                  onChange={(e) => setSimDataSource(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                >
                  <option value="Connected Meter">Connected Meter (Real Hardware)</option>
                  <option value="Imported">Imported (Batch Log)</option>
                  <option value="Simulated">Simulated (Synthetic)</option>
                </select>
              </div>
            </div>

            {simStatus === 'success' && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2.5 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>Reading successfully injected and rendered in Monitoring & Overview!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2.5 font-semibold text-white hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Ingest Real-Time Meter Telemetry Packet</span>
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Close Gateway Console
          </button>
        </div>
      </div>
    </div>
  );
};
