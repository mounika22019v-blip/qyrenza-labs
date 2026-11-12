import {
  Organization,
  Building,
  Device,
  EnergyReading,
  Anomaly,
  Recommendation,
  EnergyReport,
  User,
  UserSettings,
} from '../types/energy';

export const INITIAL_USER: User = {
  id: 'usr-1',
  name: 'Mounika Reddy',
  email: 'n7282433@gmail.com',
  role: 'admin',
  organizationId: 'org-demo-1',
  avatarUrl: '',
};

export const INITIAL_SETTINGS: UserSettings = {
  electricityTariff: 8.5,
  peakMultiplier: 1.25,
  currency: '₹',
  energyUnit: 'kWh',
  emailAlerts: true,
  anomalySensitivity: 'Medium',
  nightAlertThresholdKwh: 35,
};

export const DEMO_ORGANIZATION: Organization = {
  id: 'org-demo-1',
  name: 'Qyrenza Demo Campus',
  type: 'Educational Institution',
  location: 'Knowledge City, Hyderabad, Telangana',
  electricityTariff: 8.5,
  peakTariffMultiplier: 1.25,
  currency: '₹',
  buildingCount: 5,
  adminName: 'Nama Mounika',
  adminEmail: 'n7282433@gmail.com',
  createdAt: '2026-01-15T09:00:00Z',
};

export const SECONDARY_ORGANIZATION: Organization = {
  id: 'org-tech-2',
  name: 'Cyber Towers Tech Park',
  type: 'Commercial Office',
  location: 'HITEC City, Madhapur',
  electricityTariff: 9.2,
  peakTariffMultiplier: 1.3,
  currency: '₹',
  buildingCount: 2,
  adminName: 'Medapati Madhulika Reddy',
  adminEmail: 'n7282433@gmail.com',
  createdAt: '2026-02-01T10:00:00Z',
};

export const DEMO_BUILDINGS: Building[] = [
  {
    id: 'b-acad',
    organizationId: 'org-demo-1',
    name: 'Academic Block',
    type: 'Academic / Lecture Halls',
    areaSqFt: 48000,
    baselineKwhDaily: 340,
    status: 'Active',
    efficiencyScore: 89,
    deviceCount: 3,
    notes: 'Smart classrooms, lecture auditoriums, digital teaching pods.',
  },
  {
    id: 'b-admin',
    organizationId: 'org-demo-1',
    name: 'Administrative Block',
    type: 'Offices & Server Room',
    areaSqFt: 28000,
    baselineKwhDaily: 220,
    status: 'Active',
    efficiencyScore: 92,
    deviceCount: 4,
    notes: 'Administration executive wings, IT infrastructure, boardrooms.',
  },
  {
    id: 'b-lib',
    organizationId: 'org-demo-1',
    name: 'Central Library',
    type: 'Study Center & Archives',
    areaSqFt: 32000,
    baselineKwhDaily: 190,
    status: 'Active',
    efficiencyScore: 94,
    deviceCount: 3,
    notes: 'Digitized repository, quiet reading zones, humidity-controlled stacks.',
  },
  {
    id: 'b-hostel',
    organizationId: 'org-demo-1',
    name: 'Hostel Complex',
    type: 'Residential & Dining',
    areaSqFt: 64000,
    baselineKwhDaily: 420,
    status: 'Active',
    efficiencyScore: 78,
    deviceCount: 3,
    notes: 'Student dormitories, solar thermal backup, water distribution pumps.',
  },
  {
    id: 'b-lab',
    organizationId: 'org-demo-1',
    name: 'Advanced Research Laboratory',
    type: 'High Precision Lab',
    areaSqFt: 36000,
    baselineKwhDaily: 440,
    status: 'Active',
    efficiencyScore: 84,
    deviceCount: 3,
    notes: 'Cleanroom facility, mass spectrometers, automated fume hoods.',
  },
];

export const DEMO_DEVICES: Device[] = [
  {
    id: 'dev-1',
    organizationId: 'org-demo-1',
    buildingId: 'b-acad',
    name: 'Central Chiller Unit AC-1',
    category: 'HVAC',
    capacityKw: 45,
    status: 'Connected',
    location: 'Rooftop Plant Room',
    lastReadingKwh: 34.2,
    installDate: '2025-08-10',
  },
  {
    id: 'dev-2',
    organizationId: 'org-demo-1',
    buildingId: 'b-acad',
    name: 'Lecture Auditoriums Lighting Grid',
    category: 'Lighting',
    capacityKw: 8.5,
    status: 'Connected',
    location: 'Floors 1-3',
    lastReadingKwh: 6.8,
    installDate: '2025-09-01',
  },
  {
    id: 'dev-3',
    organizationId: 'org-demo-1',
    buildingId: 'b-acad',
    name: 'Computer Science Lab Workstations',
    category: 'Computers',
    capacityKw: 14.0,
    status: 'Connected',
    location: 'Floor 2 East Wing',
    lastReadingKwh: 11.4,
    installDate: '2025-09-15',
  },
  {
    id: 'dev-4',
    organizationId: 'org-demo-1',
    buildingId: 'b-admin',
    name: 'Server Room Precision Cooling',
    category: 'HVAC',
    capacityKw: 22.0,
    status: 'Connected',
    location: 'Ground Floor Datacenter',
    lastReadingKwh: 18.5,
    installDate: '2025-07-20',
  },
  {
    id: 'dev-5',
    organizationId: 'org-demo-1',
    buildingId: 'b-admin',
    name: 'Office Administrative PCs & Printers',
    category: 'Computers',
    capacityKw: 9.2,
    status: 'Connected',
    location: 'Main Executive Floor',
    lastReadingKwh: 7.1,
    installDate: '2025-08-01',
  },
  {
    id: 'dev-6',
    organizationId: 'org-demo-1',
    buildingId: 'b-admin',
    name: 'Executive Wing VRF System',
    category: 'HVAC',
    capacityKw: 16.5,
    status: 'Connected',
    location: 'Floor 2 Rooftop Deck',
    lastReadingKwh: 12.3,
    installDate: '2025-08-12',
  },
  {
    id: 'dev-7',
    organizationId: 'org-demo-1',
    buildingId: 'b-admin',
    name: 'Admin Corridor LED Downlights',
    category: 'Lighting',
    capacityKw: 4.2,
    status: 'Demo Device',
    location: 'All Floors Corridors',
    lastReadingKwh: 3.1,
    installDate: '2025-09-10',
  },
  {
    id: 'dev-8',
    organizationId: 'org-demo-1',
    buildingId: 'b-lib',
    name: 'Archives Humidity Control Unit',
    category: 'HVAC',
    capacityKw: 15.0,
    status: 'Connected',
    location: 'Basement Archive Stacks',
    lastReadingKwh: 12.8,
    installDate: '2025-08-25',
  },
  {
    id: 'dev-9',
    organizationId: 'org-demo-1',
    buildingId: 'b-lib',
    name: 'Reading Hall Glare-Free Luminaires',
    category: 'Lighting',
    capacityKw: 6.8,
    status: 'Connected',
    location: 'Central Atrium Stacks',
    lastReadingKwh: 5.2,
    installDate: '2025-09-05',
  },
  {
    id: 'dev-10',
    organizationId: 'org-demo-1',
    buildingId: 'b-lib',
    name: 'Digital Catalog Terminals & Wi-Fi Core',
    category: 'Computers',
    capacityKw: 5.5,
    status: 'Connected',
    location: 'Floor 1 Portal',
    lastReadingKwh: 4.4,
    installDate: '2025-09-12',
  },
  {
    id: 'dev-11',
    organizationId: 'org-demo-1',
    buildingId: 'b-hostel',
    name: 'Main Borewell Hydro-Pneumatic Pump',
    category: 'Pumps',
    capacityKw: 11.0,
    status: 'Connected',
    location: 'Pump House Bay 2',
    lastReadingKwh: 9.8,
    installDate: '2025-07-15',
  },
  {
    id: 'dev-12',
    organizationId: 'org-demo-1',
    buildingId: 'b-hostel',
    name: 'Solar-Assisted Water Heaters',
    category: 'Other',
    capacityKw: 25.0,
    status: 'Connected',
    location: 'Hostel Roof Terrace',
    lastReadingKwh: 19.2,
    installDate: '2025-08-30',
  },
  {
    id: 'dev-13',
    organizationId: 'org-demo-1',
    buildingId: 'b-hostel',
    name: 'Dormitory Hallway Lighting Grid',
    category: 'Lighting',
    capacityKw: 5.0,
    status: 'Connected',
    location: 'Wings A, B, C',
    lastReadingKwh: 4.1,
    installDate: '2025-09-18',
  },
  {
    id: 'dev-14',
    organizationId: 'org-demo-1',
    buildingId: 'b-lab',
    name: 'Cleanroom ISO-6 Air Filtration System',
    category: 'HVAC',
    capacityKw: 38.0,
    status: 'Connected',
    location: 'Lab Technical Mezzanine',
    lastReadingKwh: 31.6,
    installDate: '2025-06-20',
  },
  {
    id: 'dev-15',
    organizationId: 'org-demo-1',
    buildingId: 'b-lab',
    name: 'Analytical Spectrometry Suite',
    category: 'Laboratory Equipment',
    capacityKw: 12.0,
    status: 'Connected',
    location: 'Chemistry Lab 102',
    lastReadingKwh: 9.5,
    installDate: '2025-07-01',
  },
  {
    id: 'dev-16',
    organizationId: 'org-demo-1',
    buildingId: 'b-lab',
    name: 'Chemical Fume Extraction Hood Blower',
    category: 'Laboratory Equipment',
    capacityKw: 16.0,
    status: 'Connected',
    location: 'Exhaust Shaft Lab B',
    lastReadingKwh: 14.8,
    installDate: '2025-07-10',
  },
];

/**
 * Generates 14 days of realistic hourly readings.
 */
export function generateDemoReadings(): EnergyReading[] {
  const readings: EnergyReading[] = [];
  const now = new Date('2026-11-07T12:00:00Z');
  const orgId = 'org-demo-1';
  const tariff = 8.5;
  const peakMult = 1.25;

  // 14 days * 24 hours = 336 time points
  for (let d = 13; d >= 0; d--) {
    const dayDate = new Date(now.getTime() - d * 24 * 3600 * 1000);
    const dayOfWeek = dayDate.getDay(); // 0 is Sun, 6 is Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    for (let h = 0; h < 24; h++) {
      const pointDate = new Date(dayDate);
      pointDate.setHours(h, 0, 0, 0);
      const iso = pointDate.toISOString();

      const isPeakHour = h >= 9 && h <= 18 && !isWeekend;
      const rate = isPeakHour ? tariff * peakMult : tariff;

      // Generate for each building
      for (const b of DEMO_BUILDINGS) {
        // Hourly profile curve
        let hourFactor = 0.25; // nighttime baseload
        if (h >= 6 && h <= 8) hourFactor = 0.55; // morning ramp-up
        else if (h >= 9 && h <= 13) hourFactor = 0.95; // peak morning
        else if (h >= 14 && h <= 18) hourFactor = 0.9; // afternoon
        else if (h >= 19 && h <= 22) hourFactor = 0.45; // evening

        // Weekend adjustment
        if (isWeekend) {
          if (b.id === 'b-acad' || b.id === 'b-admin') {
            hourFactor *= 0.28;
          } else if (b.id === 'b-hostel') {
            hourFactor *= 1.15; // higher residential usage
          }
        }

        // Special building nuances
        if (b.id === 'b-hostel' && (h >= 6 && h <= 9 || h >= 18 && h <= 22)) {
          hourFactor = 0.98; // hostel peaks morning & evening
        }

        // Add anomaly injects
        let isAnomaly = false;
        let anomalyMultiplier = 1.0;

        // Anomaly 1: Academic block HVAC left on full blast at 2am 3 days ago
        if (d === 3 && h >= 1 && h <= 4 && b.id === 'b-acad') {
          isAnomaly = true;
          anomalyMultiplier = 2.8;
        }

        // Anomaly 2: Hostel borewell pump continuous run 1 day ago
        if (d === 1 && h >= 11 && h <= 15 && b.id === 'b-hostel') {
          isAnomaly = true;
          anomalyMultiplier = 1.9;
        }

        // Anomaly 3: Lab fume extraction spike 5 days ago
        if (d === 5 && h >= 14 && h <= 17 && b.id === 'b-lab') {
          isAnomaly = true;
          anomalyMultiplier = 1.75;
        }

        const hourlyBase = b.baselineKwhDaily / 24;
        const randomJitter = (Math.sin(h * 0.7 + d) * 0.08) + 1.0;
        const consumption = Math.round(hourlyBase * hourFactor * randomJitter * anomalyMultiplier * 10) / 10;
        const cost = Math.round(consumption * rate * 100) / 100;

        readings.push({
          id: `rd-${b.id}-${d}-${h}`,
          organizationId: orgId,
          buildingId: b.id,
          deviceId: b.id === 'b-acad' ? 'dev-1' : b.id === 'b-admin' ? 'dev-4' : b.id === 'b-lib' ? 'dev-8' : b.id === 'b-hostel' ? 'dev-11' : 'dev-14',
          timestamp: iso,
          consumptionKwh: consumption,
          costInr: cost,
          isPeak: isPeakHour,
          isAnomaly,
          dataSource: 'Simulated',
        });
      }
    }
  }

  return readings;
}

export const DEMO_ANOMALIES: Anomaly[] = [
  {
    id: 'anom-1',
    organizationId: 'org-demo-1',
    buildingId: 'b-acad',
    buildingName: 'Academic Block',
    deviceId: 'dev-1',
    deviceName: 'Central Chiller Unit AC-1',
    detectionTime: '2026-11-04T02:15:00Z',
    expectedKwh: 4.8,
    observedKwh: 38.6,
    differencePercentage: 704,
    severity: 'High',
    explanation:
      'Chiller unit compressor continued operating at 85% load outside schedule between 01:00 AM and 04:30 AM when campus was vacant.',
    recommendedInvestigation:
      'Inspect BMS automation override timer, verify thermostat night setback schedule, and check floor occupancy sensors.',
    status: 'Acknowledged',
    notes: 'Campus facility team notified. Override set back to standard 10:00 PM cutoff.',
    acknowledgedAt: '2026-11-04T08:30:00Z',
  },
  {
    id: 'anom-2',
    organizationId: 'org-demo-1',
    buildingId: 'b-hostel',
    buildingName: 'Hostel Complex',
    deviceId: 'dev-11',
    deviceName: 'Main Borewell Hydro-Pneumatic Pump',
    detectionTime: '2026-11-06T12:40:00Z',
    expectedKwh: 5.2,
    observedKwh: 18.9,
    differencePercentage: 263,
    severity: 'High',
    explanation:
      'Water pressure booster pump experienced continuous cycling without auto-shutoff due to probable float level sensor malfunction.',
    recommendedInvestigation:
      'Check overhead tank mechanical float valve, inspect inlet non-return valve for backflow, and calibrate pump pressure switch.',
    status: 'Detected',
  },
  {
    id: 'anom-3',
    organizationId: 'org-demo-1',
    buildingId: 'b-lab',
    buildingName: 'Advanced Research Laboratory',
    deviceId: 'dev-16',
    deviceName: 'Chemical Fume Extraction Hood Blower',
    detectionTime: '2026-11-02T15:20:00Z',
    expectedKwh: 8.5,
    observedKwh: 16.0,
    differencePercentage: 88,
    severity: 'Medium',
    explanation:
      'Exhaust sash was left raised to maximum aperture over an idle weekend shift, forcing variable air volume (VAV) blower to full capacity.',
    recommendedInvestigation:
      'Remind lab researchers to close fume hood sashes when unattended; calibrate auto-sash motorized closure mechanism.',
    status: 'Resolved',
    notes: 'Sash closure policy enforced in Lab 102. Auto-closure recalibrated by technician.',
    acknowledgedAt: '2026-11-02T16:00:00Z',
    resolvedAt: '2026-11-03T11:00:00Z',
  },
  {
    id: 'anom-4',
    organizationId: 'org-demo-1',
    buildingId: 'b-admin',
    buildingName: 'Administrative Block',
    deviceId: 'dev-5',
    deviceName: 'Office Administrative PCs & Printers',
    detectionTime: '2026-11-05T21:10:00Z',
    expectedKwh: 2.1,
    observedKwh: 5.8,
    differencePercentage: 176,
    severity: 'Low',
    explanation:
      'Unscheduled computing cluster active during evening hours due to bulk backup archive synchronization.',
    recommendedInvestigation:
      'Shift automated network backup jobs to off-peak tariff window (00:00 AM - 05:00 AM).',
    status: 'Detected',
  },
];

export const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    organizationId: 'org-demo-1',
    buildingId: 'b-acad',
    title: 'Review HVAC Operating Schedules for Academic Block',
    explanation:
      'Analysis indicates central chillers cycle during empty weekend windows and early hours before classes commence.',
    priority: 'High',
    suggestedAction:
      'Implement smart schedule locking in BMS, enforcing dynamic ramp-up 30 minutes prior to first morning lectures.',
    estimatedSavingsKwh: 1420,
    estimatedSavingsInr: 12070,
    status: 'In Progress',
    category: 'HVAC Optimization',
    createdAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-05T14:30:00Z',
  },
  {
    id: 'rec-2',
    organizationId: 'org-demo-1',
    buildingId: 'b-hostel',
    title: 'Investigate Water Pump Pressure Switch & Continuous Run',
    explanation:
      'Hostel water distribution pumps show excessive cycling outside high-demand morning and evening bathing intervals.',
    priority: 'High',
    suggestedAction:
      'Replace aging float switch with digital level transmitter and install variable frequency drive (VFD).',
    estimatedSavingsKwh: 680,
    estimatedSavingsInr: 5780,
    status: 'Pending',
    category: 'Pumping Systems',
    createdAt: '2026-11-02T10:00:00Z',
    updatedAt: '2026-11-02T10:00:00Z',
  },
  {
    id: 'rec-3',
    organizationId: 'org-demo-1',
    buildingId: 'b-admin',
    title: 'Implement Occupancy-Based Lighting in Administrative Block',
    explanation:
      'Corridor and conference room LED grids remain energized continuously for 14 hours each workday regardless of occupancy.',
    priority: 'Medium',
    suggestedAction:
      'Install passive infrared (PIR) and microwave dual-tech motion sensors with a 10-minute auto-dim timeout.',
    estimatedSavingsKwh: 390,
    estimatedSavingsInr: 3315,
    status: 'Completed',
    category: 'Lighting Control',
    createdAt: '2026-10-25T09:00:00Z',
    updatedAt: '2026-11-03T16:45:00Z',
  },
  {
    id: 'rec-4',
    organizationId: 'org-demo-1',
    buildingId: 'b-lab',
    title: 'Shift High-Demand Equipment Runs to Off-Peak Tariff Window',
    explanation:
      'Thermal chambers and spectrometry calibration batches currently run during peak tariff hours (10:00 AM - 02:00 PM).',
    priority: 'Medium',
    suggestedAction:
      'Schedule automated overnight test sequences between 11:00 PM and 06:00 AM to capitalize on base tariff rates.',
    estimatedSavingsKwh: 850,
    estimatedSavingsInr: 8925,
    status: 'Pending',
    category: 'Load Shifting',
    createdAt: '2026-11-03T11:00:00Z',
    updatedAt: '2026-11-03T11:00:00Z',
  },
  {
    id: 'rec-5',
    organizationId: 'org-demo-1',
    buildingId: 'b-lib',
    title: 'Fine-Tune Library Archive Climate Setpoint by +1.5°C',
    explanation:
      'Climate control setpoint is currently 19.5°C; ASHRAE archive guidelines allow 21.0°C without risk to paper artifacts.',
    priority: 'Low',
    suggestedAction:
      'Adjust BMS thermostat to 21.0°C and maintain 45% relative humidity buffer.',
    estimatedSavingsKwh: 520,
    estimatedSavingsInr: 4420,
    status: 'Pending',
    category: 'Thermostat Setpoints',
    createdAt: '2026-11-04T14:00:00Z',
    updatedAt: '2026-11-04T14:00:00Z',
  },
];

export const DEMO_REPORTS: EnergyReport[] = [
  {
    id: 'rep-monthly-oct',
    organizationId: 'org-demo-1',
    title: 'Monthly Campus Energy Audit — October 2026',
    type: 'Monthly',
    periodStart: '2026-10-01T00:00:00Z',
    periodEnd: '2026-10-31T23:59:59Z',
    totalKwh: 48920,
    totalCostInr: 432540,
    totalSavedKwh: 3860,
    buildingBreakdown: [
      { buildingName: 'Academic Block', consumptionKwh: 12450, costInr: 109850 },
      { buildingName: 'Administrative Block', consumptionKwh: 7820, costInr: 68900 },
      { buildingName: 'Central Library', consumptionKwh: 6140, costInr: 53950 },
      { buildingName: 'Hostel Complex', consumptionKwh: 11210, costInr: 99120 },
      { buildingName: 'Advanced Research Laboratory', consumptionKwh: 11300, costInr: 100720 },
    ],
    equipmentBreakdown: [
      { category: 'HVAC', consumptionKwh: 23480, costInr: 207800 },
      { category: 'Lighting', consumptionKwh: 6850, costInr: 60500 },
      { category: 'Computers', consumptionKwh: 5920, costInr: 52300 },
      { category: 'Pumps', consumptionKwh: 4120, costInr: 36450 },
      { category: 'Laboratory Equipment', consumptionKwh: 5850, costInr: 51890 },
      { category: 'Other', consumptionKwh: 2700, costInr: 23600 },
    ],
    generatedAt: '2026-11-01T00:15:00Z',
  },
  {
    id: 'rep-weekly-w44',
    organizationId: 'org-demo-1',
    title: 'Weekly Executive Energy Brief — Week 44',
    type: 'Weekly',
    periodStart: '2026-10-27T00:00:00Z',
    periodEnd: '2026-11-02T23:59:59Z',
    totalKwh: 11240,
    totalCostInr: 99450,
    totalSavedKwh: 920,
    buildingBreakdown: [
      { buildingName: 'Academic Block', consumptionKwh: 2910, costInr: 25700 },
      { buildingName: 'Administrative Block', consumptionKwh: 1780, costInr: 15750 },
      { buildingName: 'Central Library', consumptionKwh: 1420, costInr: 12560 },
      { buildingName: 'Hostel Complex', consumptionKwh: 2540, costInr: 22480 },
      { buildingName: 'Advanced Research Laboratory', consumptionKwh: 2590, costInr: 22960 },
    ],
    equipmentBreakdown: [
      { category: 'HVAC', consumptionKwh: 5390, costInr: 47700 },
      { category: 'Lighting', consumptionKwh: 1570, costInr: 13900 },
      { category: 'Computers', consumptionKwh: 1360, costInr: 12000 },
      { category: 'Pumps', consumptionKwh: 950, costInr: 8400 },
      { category: 'Laboratory Equipment', consumptionKwh: 1350, costInr: 11950 },
      { category: 'Other', consumptionKwh: 620, costInr: 5500 },
    ],
    generatedAt: '2026-11-03T07:00:00Z',
  },
];
