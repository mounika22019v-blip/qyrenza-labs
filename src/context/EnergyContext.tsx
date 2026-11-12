import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  Organization,
  Building,
  Device,
  EnergyReading,
  Anomaly,
  Recommendation,
  EnergyReport,
  UserSettings,
  RecommendationStatus,
  AnomalyStatus,
  ReportType,
} from '../types/energy';
import {
  INITIAL_USER,
  INITIAL_SETTINGS,
  DEMO_ORGANIZATION,
  SECONDARY_ORGANIZATION,
  DEMO_BUILDINGS,
  DEMO_DEVICES,
  generateDemoReadings,
  DEMO_ANOMALIES,
  DEMO_RECOMMENDATIONS,
  DEMO_REPORTS,
} from '../data/demoData';

interface EnergyContextType {
  // Auth & User
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string, orgName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;

  // Organizations
  organizations: Organization[];
  currentOrg: Organization;
  setCurrentOrgId: (orgId: string) => void;
  createOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => Organization;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;

  // Buildings
  buildings: Building[];
  addBuilding: (b: Omit<Building, 'id' | 'efficiencyScore' | 'deviceCount'>) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;

  // Devices
  devices: Device[];
  addDevice: (d: Omit<Device, 'id' | 'lastReadingKwh'>) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;

  // Readings
  readings: EnergyReading[];
  ingestReading: (reading: Omit<EnergyReading, 'id'>) => void;

  // Anomalies
  anomalies: Anomaly[];
  acknowledgeAnomaly: (id: string, notes?: string) => void;
  resolveAnomaly: (id: string, notes?: string) => void;

  // Recommendations
  recommendations: Recommendation[];
  updateRecommendationStatus: (id: string, status: RecommendationStatus) => void;

  // Reports
  reports: EnergyReport[];
  generateReport: (title: string, type: ReportType, start: string, end: string) => EnergyReport;

  // Settings & Demo Mode
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  isDemoMode: boolean;
  resetDemoData: () => void;
}

const STORAGE_KEY_PREFIX = 'qyrenza_labs_v1_';

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Organizations
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}orgs`);
      return stored ? JSON.parse(stored) : [DEMO_ORGANIZATION, SECONDARY_ORGANIZATION];
    } catch {
      return [DEMO_ORGANIZATION, SECONDARY_ORGANIZATION];
    }
  });

  const [currentOrgId, setCurrentOrgId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_org`);
      return stored || DEMO_ORGANIZATION.id;
    } catch {
      return DEMO_ORGANIZATION.id;
    }
  });

  // Buildings
  const [buildings, setBuildings] = useState<Building[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}buildings`);
      return stored ? JSON.parse(stored) : DEMO_BUILDINGS;
    } catch {
      return DEMO_BUILDINGS;
    }
  });

  // Devices
  const [devices, setDevices] = useState<Device[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}devices`);
      return stored ? JSON.parse(stored) : DEMO_DEVICES;
    } catch {
      return DEMO_DEVICES;
    }
  });

  // Readings
  const [readings, setReadings] = useState<EnergyReading[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}readings`);
      return stored ? JSON.parse(stored) : generateDemoReadings();
    } catch {
      return generateDemoReadings();
    }
  });

  // Anomalies
  const [anomalies, setAnomalies] = useState<Anomaly[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}anomalies`);
      return stored ? JSON.parse(stored) : DEMO_ANOMALIES;
    } catch {
      return DEMO_ANOMALIES;
    }
  });

  // Recommendations
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}recommendations`);
      return stored ? JSON.parse(stored) : DEMO_RECOMMENDATIONS;
    } catch {
      return DEMO_RECOMMENDATIONS;
    }
  });

  // Reports
  const [reports, setReports] = useState<EnergyReport[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}reports`);
      return stored ? JSON.parse(stored) : DEMO_REPORTS;
    } catch {
      return DEMO_REPORTS;
    }
  });

  // Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(user));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}orgs`, JSON.stringify(organizations));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}current_org`, currentOrgId);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}buildings`, JSON.stringify(buildings));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}devices`, JSON.stringify(devices));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}readings`, JSON.stringify(readings));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}anomalies`, JSON.stringify(anomalies));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}recommendations`, JSON.stringify(recommendations));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}reports`, JSON.stringify(reports));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
    } catch {
      // Storage quota or sandboxed env
    }
  }, [user, organizations, currentOrgId, buildings, devices, readings, anomalies, recommendations, reports, settings]);

  const currentOrg = useMemo(() => {
    return organizations.find((o) => o.id === currentOrgId) || organizations[0] || DEMO_ORGANIZATION;
  }, [organizations, currentOrgId]);

  // Auth functions
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) {
      return { success: false, error: 'Email and password are required.' };
    }
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    let displayName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('n7282433') || lowerEmail.includes('mounika')) {
      displayName = 'Mounika Reddy';
    } else if (lowerEmail.includes('madhulika')) {
      displayName = 'Madhulika Reddy';
    } else if (lowerEmail.includes('facility.lead')) {
      displayName = 'Rajesh Kumar';
    }

    const loggedUser: User = {
      id: 'usr-auth-' + Date.now(),
      name: displayName,
      email,
      role: 'admin',
      organizationId: currentOrg.id,
    };
    setUser(loggedUser);
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
    orgName: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim()) return { success: false, error: 'Name is required.' };
    if (!email.includes('@')) return { success: false, error: 'Valid email is required.' };
    if (pass.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const newOrgId = 'org-' + Date.now();
    const newOrg: Organization = {
      id: newOrgId,
      name: orgName.trim() || `${name}'s Organization`,
      type: 'Commercial Office',
      location: 'Primary Site',
      electricityTariff: 8.5,
      peakTariffMultiplier: 1.25,
      currency: '₹',
      buildingCount: 0,
      adminName: name,
      adminEmail: email,
      createdAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      role: 'admin',
      organizationId: newOrgId,
    };

    setOrganizations((prev) => [...prev, newOrg]);
    setCurrentOrgId(newOrgId);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserProfile = (profile: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...profile } : null));
  };

  // Organization operations
  const createOrganization = (orgData: Omit<Organization, 'id' | 'createdAt'>): Organization => {
    const newOrg: Organization = {
      ...orgData,
      id: 'org-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setOrganizations((prev) => [...prev, newOrg]);
    setCurrentOrgId(newOrg.id);
    return newOrg;
  };

  const updateOrganization = (id: string, updates: Partial<Organization>) => {
    setOrganizations((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  // Building operations
  const addBuilding = (b: Omit<Building, 'id' | 'efficiencyScore' | 'deviceCount'>) => {
    const newBuilding: Building = {
      ...b,
      id: 'b-' + Date.now(),
      efficiencyScore: 88,
      deviceCount: 0,
    };
    setBuildings((prev) => [...prev, newBuilding]);
    setOrganizations((prev) =>
      prev.map((o) => (o.id === b.organizationId ? { ...o, buildingCount: o.buildingCount + 1 } : o))
    );
  };

  const updateBuilding = (id: string, updates: Partial<Building>) => {
    setBuildings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBuilding = (id: string) => {
    const b = buildings.find((x) => x.id === id);
    if (!b) return;
    setBuildings((prev) => prev.filter((x) => x.id !== id));
    setDevices((prev) => prev.filter((d) => d.buildingId !== id));
    setOrganizations((prev) =>
      prev.map((o) => (o.id === b.organizationId ? { ...o, buildingCount: Math.max(0, o.buildingCount - 1) } : o))
    );
  };

  // Device operations
  const addDevice = (d: Omit<Device, 'id' | 'lastReadingKwh'>) => {
    const newDev: Device = {
      ...d,
      id: 'dev-' + Date.now(),
      lastReadingKwh: Math.round(d.capacityKw * 0.75 * 10) / 10,
    };
    setDevices((prev) => [...prev, newDev]);
    setBuildings((prev) =>
      prev.map((b) => (b.id === d.buildingId ? { ...b, deviceCount: b.deviceCount + 1 } : b))
    );
  };

  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDevice = (id: string) => {
    const dev = devices.find((x) => x.id === id);
    if (!dev) return;
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setBuildings((prev) =>
      prev.map((b) => (b.id === dev.buildingId ? { ...b, deviceCount: Math.max(0, b.deviceCount - 1) } : b))
    );
  };

  // Ingest reading (for real meter simulation, REST/Webhook)
  const ingestReading = (reading: Omit<EnergyReading, 'id'>) => {
    const newReading: EnergyReading = {
      ...reading,
      id: 'rd-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };
    setReadings((prev) => [newReading, ...prev.slice(0, 1500)]);

    // Update device last reading
    setDevices((prev) =>
      prev.map((d) => (d.id === reading.deviceId ? { ...d, lastReadingKwh: reading.consumptionKwh } : d))
    );
  };

  // Anomaly operations
  const acknowledgeAnomaly = (id: string, notes?: string) => {
    setAnomalies((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Acknowledged' as AnomalyStatus,
              notes: notes || a.notes,
              acknowledgedAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  const resolveAnomaly = (id: string, notes?: string) => {
    setAnomalies((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Resolved' as AnomalyStatus,
              notes: notes || a.notes,
              resolvedAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  // Recommendations
  const updateRecommendationStatus = (id: string, status: RecommendationStatus) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  // Reports
  const generateReport = (title: string, type: ReportType, start: string, end: string): EnergyReport => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    const rangeReadings = readings.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return r.organizationId === currentOrg.id && t >= startTime && t <= endTime;
    });

    let totalKwh = 0;
    let totalCostInr = 0;

    const bMap = new Map<string, { name: string; kwh: number; cost: number }>();
    const eqMap = new Map<string, { kwh: number; cost: number }>();

    for (const r of rangeReadings) {
      totalKwh += r.consumptionKwh;
      totalCostInr += r.costInr;

      // Building mapping
      const bName = buildings.find((b) => b.id === r.buildingId)?.name || 'Unknown Building';
      const bCurr = bMap.get(r.buildingId) || { name: bName, kwh: 0, cost: 0 };
      bMap.set(r.buildingId, {
        name: bName,
        kwh: bCurr.kwh + r.consumptionKwh,
        cost: bCurr.cost + r.costInr,
      });

      // Equipment mapping
      const dev = devices.find((d) => d.id === r.deviceId);
      const cat = dev ? dev.category : 'Other';
      const eqCurr = eqMap.get(cat) || { kwh: 0, cost: 0 };
      eqMap.set(cat, {
        kwh: eqCurr.kwh + r.consumptionKwh,
        cost: eqCurr.cost + r.costInr,
      });
    }

    const newReport: EnergyReport = {
      id: 'rep-' + Date.now(),
      organizationId: currentOrg.id,
      title: title || `${type} Energy Report (${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()})`,
      type,
      periodStart: start,
      periodEnd: end,
      totalKwh: Math.round(totalKwh * 10) / 10,
      totalCostInr: Math.round(totalCostInr * 100) / 100,
      totalSavedKwh: Math.round(totalKwh * 0.08 * 10) / 10, // ~8% typical optimization savings
      buildingBreakdown: Array.from(bMap.values()).map((v) => ({
        buildingName: v.name,
        consumptionKwh: Math.round(v.kwh * 10) / 10,
        costInr: Math.round(v.cost * 100) / 100,
      })),
      equipmentBreakdown: Array.from(eqMap.entries()).map(([cat, v]) => ({
        category: cat,
        consumptionKwh: Math.round(v.kwh * 10) / 10,
        costInr: Math.round(v.cost * 100) / 100,
      })),
      generatedAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setOrganizations([DEMO_ORGANIZATION, SECONDARY_ORGANIZATION]);
    setCurrentOrgId(DEMO_ORGANIZATION.id);
    setBuildings(DEMO_BUILDINGS);
    setDevices(DEMO_DEVICES);
    setReadings(generateDemoReadings());
    setAnomalies(DEMO_ANOMALIES);
    setRecommendations(DEMO_RECOMMENDATIONS);
    setReports(DEMO_REPORTS);
    setSettings(INITIAL_SETTINGS);
  };

  const isDemoMode = currentOrg.id === DEMO_ORGANIZATION.id;

  return (
    <EnergyContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        updateUserProfile,
        organizations,
        currentOrg,
        setCurrentOrgId,
        createOrganization,
        updateOrganization,
        buildings,
        addBuilding,
        updateBuilding,
        deleteBuilding,
        devices,
        addDevice,
        updateDevice,
        deleteDevice,
        readings,
        ingestReading,
        anomalies,
        acknowledgeAnomaly,
        resolveAnomaly,
        recommendations,
        updateRecommendationStatus,
        reports,
        generateReport,
        settings,
        updateSettings,
        isDemoMode,
        resetDemoData,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};
