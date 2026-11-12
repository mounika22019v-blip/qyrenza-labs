import { EnergyReading, Anomaly } from '../types/energy';

export interface EnergyTotals {
  totalKwh: number;
  totalCostInr: number;
  peakKwh: number;
  offPeakKwh: number;
  averageHourlyKwh: number;
  readingCount: number;
}

/**
 * Calculates energy and cost totals from a series of energy readings.
 */
export function calculateEnergyTotals(
  readings: EnergyReading[],
  tariffInr: number = 8.5,
  peakMultiplier: number = 1.25
): EnergyTotals {
  if (!readings || readings.length === 0) {
    return {
      totalKwh: 0,
      totalCostInr: 0,
      peakKwh: 0,
      offPeakKwh: 0,
      averageHourlyKwh: 0,
      readingCount: 0,
    };
  }

  let totalKwh = 0;
  let totalCostInr = 0;
  let peakKwh = 0;
  let offPeakKwh = 0;

  for (const r of readings) {
    const kwh = Number(r.consumptionKwh) || 0;
    totalKwh += kwh;

    // Use reading's explicit cost if valid, else calculate using tariff & peak multiplier
    if (r.costInr && r.costInr > 0) {
      totalCostInr += r.costInr;
    } else {
      const rate = r.isPeak ? tariffInr * peakMultiplier : tariffInr;
      totalCostInr += kwh * rate;
    }

    if (r.isPeak) {
      peakKwh += kwh;
    } else {
      offPeakKwh += kwh;
    }
  }

  const averageHourlyKwh = readings.length > 0 ? totalKwh / readings.length : 0;

  return {
    totalKwh: Math.round(totalKwh * 100) / 100,
    totalCostInr: Math.round(totalCostInr * 100) / 100,
    peakKwh: Math.round(peakKwh * 100) / 100,
    offPeakKwh: Math.round(offPeakKwh * 100) / 100,
    averageHourlyKwh: Math.round(averageHourlyKwh * 100) / 100,
    readingCount: readings.length,
  };
}

/**
 * Rule-based statistical anomaly detection across energy readings.
 * Detects:
 * 1. Spikes exceeding threshold above moving baseline (> 1.4x baseline).
 * 2. Unexpected nighttime consumption (between 23:00 and 05:00 exceeding 50% of daytime average).
 */
export function detectStatisticalAnomalies(
  readings: EnergyReading[],
  baselineKwh: number = 25,
  sensitivity: 'Low' | 'Medium' | 'High' = 'Medium'
): EnergyReading[] {
  if (!readings || readings.length === 0) return [];

  const multiplier = sensitivity === 'High' ? 1.25 : sensitivity === 'Low' ? 1.6 : 1.4;

  return readings.filter((r) => {
    const date = new Date(r.timestamp);
    const hour = date.getHours();
    const isNight = hour >= 23 || hour <= 5;

    // Nighttime anomaly: high consumption when building should be in idle/baseload
    if (isNight && r.consumptionKwh > baselineKwh * 0.75) {
      return true;
    }

    // General sudden spike anomaly
    if (r.consumptionKwh > baselineKwh * multiplier) {
      return true;
    }

    return Boolean(r.isAnomaly);
  });
}

/**
 * Calculates overall energy efficiency score (0 - 100%).
 * Considers baseline variance and anomaly impact.
 */
export function calculateEfficiencyScore(
  consumedKwh: number,
  baselineKwh: number,
  anomalyCount: number = 0
): number {
  if (baselineKwh <= 0) return 85;
  if (consumedKwh <= 0) return 100;

  // Ratio of consumption to baseline
  const ratio = consumedKwh / baselineKwh;
  let score = 100;

  if (ratio <= 0.85) {
    // Under baseline is excellent
    score = 96;
  } else if (ratio <= 1.0) {
    // Within baseline
    score = 90 - (ratio - 0.85) * 50;
  } else if (ratio <= 1.3) {
    // Mildly exceeding baseline
    score = 82 - (ratio - 1.0) * 80;
  } else {
    // Significant overconsumption
    score = Math.max(35, 58 - (ratio - 1.3) * 30);
  }

  // Deduct points for active unresolved anomalies
  score -= Math.min(25, anomalyCount * 3.5);

  return Math.max(10, Math.min(99, Math.round(score)));
}

/**
 * Filters energy readings by time range relative to reference date.
 */
export function filterReadingsByRange(
  readings: EnergyReading[],
  range: 'today' | '7d' | '30d' | '90d' | 'custom',
  referenceDate: Date = new Date(),
  customStart?: string,
  customEnd?: string
): EnergyReading[] {
  if (!readings) return [];

  const refTime = referenceDate.getTime();

  if (range === 'custom') {
    const start = customStart ? new Date(customStart).getTime() : 0;
    const end = customEnd ? new Date(customEnd).getTime() + 86400000 : Infinity;
    return readings.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return t >= start && t <= end;
    });
  }

  const durationMs =
    range === 'today'
      ? 24 * 60 * 60 * 1000
      : range === '7d'
      ? 7 * 24 * 60 * 60 * 1000
      : range === '30d'
      ? 30 * 24 * 60 * 60 * 1000
      : 90 * 24 * 60 * 60 * 1000;

  const minTime = refTime - durationMs;
  return readings.filter((r) => new Date(r.timestamp).getTime() >= minTime);
}

/**
 * Aggregates reading data for charting by hour, day, or week.
 */
export function aggregateReadingsForChart(
  readings: EnergyReading[],
  groupBy: 'hour' | 'day' | 'building'
): { label: string; consumptionKwh: number; costInr: number; count: number }[] {
  const map = new Map<string, { consumptionKwh: number; costInr: number; count: number }>();

  for (const r of readings) {
    let key = '';
    const date = new Date(r.timestamp);

    if (groupBy === 'hour') {
      key = `${date.getHours().toString().padStart(2, '0')}:00`;
    } else if (groupBy === 'day') {
      key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      key = r.buildingId;
    }

    const current = map.get(key) || { consumptionKwh: 0, costInr: 0, count: 0 };
    map.set(key, {
      consumptionKwh: Math.round((current.consumptionKwh + r.consumptionKwh) * 100) / 100,
      costInr: Math.round((current.costInr + r.costInr) * 100) / 100,
      count: current.count + 1,
    });
  }

  return Array.from(map.entries()).map(([label, val]) => ({
    label,
    ...val,
  }));
}

/**
 * Exports tabular data as a clean, downloadable CSV file.
 */
export function generateCsvContent(data: Record<string, any>[]): string {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const val = row[header] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',')
  );

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Triggers browser download for CSV string.
 */
export function downloadCsvFile(csvContent: string, fileName: string): boolean {
  if (typeof window === 'undefined') return false;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;
}

export function formatKwh(kwh: number): string {
  return `${kwh.toLocaleString('en-IN', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })} kWh`;
}

/**
 * Extracts the first name only from a user's full name.
 * e.g. "Mounika Reddy" -> "Mounika"
 *      "Madhulika Reddy" -> "Madhulika"
 */
export function getUserFirstName(fullName?: string | null): string {
  if (!fullName) return 'User';
  const trimmed = fullName.trim();
  if (!trimmed) return 'User';
  const parts = trimmed.split(/\s+/);
  return parts[0] || 'User';
}
