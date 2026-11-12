export type UserRole = 'admin' | 'facility_manager' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
}

export type OrgType =
  | 'Educational Institution'
  | 'Commercial Office'
  | 'Hostel'
  | 'Small Business'
  | 'Other';

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  location: string;
  electricityTariff: number; // in INR (₹) per kWh, e.g. 8.50
  peakTariffMultiplier: number; // e.g. 1.25 for peak hours
  currency: string; // '₹'
  buildingCount: number;
  adminName: string;
  adminEmail: string;
  createdAt: string;
}

export interface Building {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  areaSqFt: number;
  baselineKwhDaily: number;
  status: 'Active' | 'Under Maintenance';
  efficiencyScore: number;
  deviceCount: number;
  notes?: string;
}

export type DeviceCategory =
  | 'HVAC'
  | 'Lighting'
  | 'Computers'
  | 'Pumps'
  | 'Laboratory Equipment'
  | 'Other';

export type DeviceStatus = 'Connected' | 'Offline' | 'Demo Device';

export interface Device {
  id: string;
  organizationId: string;
  buildingId: string;
  name: string;
  category: DeviceCategory;
  capacityKw: number;
  status: DeviceStatus;
  location: string;
  lastReadingKwh: number;
  installDate: string;
}

export interface EnergyReading {
  id: string;
  organizationId: string;
  buildingId: string;
  deviceId: string;
  timestamp: string; // ISO 8601
  consumptionKwh: number;
  costInr: number;
  isPeak: boolean;
  isAnomaly: boolean;
  dataSource: 'Simulated' | 'Imported' | 'Connected Meter';
}

export type AnomalySeverity = 'High' | 'Medium' | 'Low';
export type AnomalyStatus = 'Detected' | 'Acknowledged' | 'Resolved';

export interface Anomaly {
  id: string;
  organizationId: string;
  buildingId: string;
  buildingName: string;
  deviceId: string;
  deviceName: string;
  detectionTime: string;
  expectedKwh: number;
  observedKwh: number;
  differencePercentage: number;
  severity: AnomalySeverity;
  explanation: string;
  recommendedInvestigation: string;
  status: AnomalyStatus;
  notes?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export type RecommendationPriority = 'High' | 'Medium' | 'Low';
export type RecommendationStatus = 'Pending' | 'In Progress' | 'Completed' | 'Dismissed';

export interface Recommendation {
  id: string;
  organizationId: string;
  buildingId?: string;
  title: string;
  explanation: string;
  priority: RecommendationPriority;
  suggestedAction: string;
  estimatedSavingsKwh: number;
  estimatedSavingsInr: number;
  status: RecommendationStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportType =
  | 'Daily'
  | 'Weekly'
  | 'Monthly'
  | 'Building Comparison'
  | 'Equipment'
  | 'Anomaly'
  | 'Savings';

export interface EnergyReport {
  id: string;
  organizationId: string;
  title: string;
  type: ReportType;
  periodStart: string;
  periodEnd: string;
  totalKwh: number;
  totalCostInr: number;
  totalSavedKwh: number;
  buildingBreakdown: { buildingName: string; consumptionKwh: number; costInr: number }[];
  equipmentBreakdown: { category: string; consumptionKwh: number; costInr: number }[];
  generatedAt: string;
}

export interface UserSettings {
  electricityTariff: number; // ₹ per kWh
  peakMultiplier: number;
  currency: string;
  energyUnit: string;
  emailAlerts: boolean;
  anomalySensitivity: 'Low' | 'Medium' | 'High';
  nightAlertThresholdKwh: number;
}
