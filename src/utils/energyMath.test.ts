import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEnergyTotals,
  detectStatisticalAnomalies,
  calculateEfficiencyScore,
  filterReadingsByRange,
  generateCsvContent,
  formatInr,
  formatKwh,
  getUserFirstName,
} from './energyMath';
import { EnergyReading } from '../types/energy';

test('calculateEnergyTotals correctly sums consumption and converts tariff to INR', () => {
  const mockReadings: EnergyReading[] = [
    {
      id: 'r1',
      organizationId: 'org1',
      buildingId: 'b1',
      deviceId: 'd1',
      timestamp: '2026-11-01T10:00:00Z',
      consumptionKwh: 100,
      costInr: 850,
      isPeak: false,
      isAnomaly: false,
      dataSource: 'Simulated',
    },
    {
      id: 'r2',
      organizationId: 'org1',
      buildingId: 'b1',
      deviceId: 'd2',
      timestamp: '2026-11-01T14:00:00Z',
      consumptionKwh: 50,
      costInr: 531.25,
      isPeak: true,
      isAnomaly: false,
      dataSource: 'Simulated',
    },
  ];

  const totals = calculateEnergyTotals(mockReadings, 8.5, 1.25);
  assert.equal(totals.totalKwh, 150);
  assert.equal(totals.totalCostInr, 1381.25);
  assert.equal(totals.peakKwh, 50);
  assert.equal(totals.offPeakKwh, 100);
  assert.equal(totals.readingCount, 2);
});

test('calculateEnergyTotals handles empty array safely', () => {
  const totals = calculateEnergyTotals([]);
  assert.equal(totals.totalKwh, 0);
  assert.equal(totals.totalCostInr, 0);
  assert.equal(totals.readingCount, 0);
});

test('detectStatisticalAnomalies flags high nighttime usage', () => {
  const nightSpike: EnergyReading = {
    id: 'r-night',
    organizationId: 'org1',
    buildingId: 'b1',
    deviceId: 'd1',
    timestamp: '2026-11-01T02:30:00Z', // 02:30 AM
    consumptionKwh: 45, // baseline is 25, 45 > 25 * 0.75
    costInr: 382.5,
    isPeak: false,
    isAnomaly: false,
    dataSource: 'Simulated',
  };

  const anomalies = detectStatisticalAnomalies([nightSpike], 25, 'Medium');
  assert.equal(anomalies.length, 1);
  assert.equal(anomalies[0].id, 'r-night');
});

test('calculateEfficiencyScore penalizes excessive consumption and anomalies', () => {
  const scoreOptimal = calculateEfficiencyScore(80, 100, 0);
  const scoreHighSpike = calculateEfficiencyScore(160, 100, 3);

  assert.ok(scoreOptimal >= 90, 'Optimal consumption should score >= 90%');
  assert.ok(scoreHighSpike < 60, 'Overconsumption with anomalies should score < 60%');
});

test('filterReadingsByRange filters according to window', () => {
  const refDate = new Date('2026-11-07T12:00:00Z');
  const mockReadings: EnergyReading[] = [
    {
      id: 'recent',
      organizationId: 'org1',
      buildingId: 'b1',
      deviceId: 'd1',
      timestamp: '2026-11-07T08:00:00Z', // 4 hours ago
      consumptionKwh: 20,
      costInr: 170,
      isPeak: false,
      isAnomaly: false,
      dataSource: 'Simulated',
    },
    {
      id: 'old',
      organizationId: 'org1',
      buildingId: 'b1',
      deviceId: 'd1',
      timestamp: '2026-10-01T08:00:00Z', // > 30 days ago
      consumptionKwh: 25,
      costInr: 212.5,
      isPeak: false,
      isAnomaly: false,
      dataSource: 'Simulated',
    },
  ];

  const todayResult = filterReadingsByRange(mockReadings, 'today', refDate);
  assert.equal(todayResult.length, 1);
  assert.equal(todayResult[0].id, 'recent');

  const ninetyDaysResult = filterReadingsByRange(mockReadings, '90d', refDate);
  assert.equal(ninetyDaysResult.length, 2);
});

test('generateCsvContent properly escapes quotes and headers', () => {
  const sample = [
    { building: 'Academic "A"', kwh: 120.5 },
    { building: 'Hostel Block', kwh: 85.0 },
  ];
  const csv = generateCsvContent(sample);
  assert.ok(csv.includes('"Academic ""A"""'));
  assert.ok(csv.includes('"Hostel Block"'));
  assert.ok(csv.includes('building,kwh'));
});

test('formatters format currency and kwh accurately', () => {
  assert.equal(formatInr(12500), '₹12,500');
  assert.equal(formatKwh(340.5), '340.5 kWh');
});

test('getUserFirstName dynamically extracts first name only from user profile', () => {
  assert.equal(getUserFirstName('Mounika Reddy'), 'Mounika');
  assert.equal(getUserFirstName('Madhulika Reddy'), 'Madhulika');
  assert.equal(getUserFirstName('   Rajesh   Kumar  '), 'Rajesh');
  assert.equal(getUserFirstName('Alice'), 'Alice');
  assert.equal(getUserFirstName(''), 'User');
  assert.equal(getUserFirstName(null), 'User');
  assert.equal(getUserFirstName(undefined), 'User');
});
