import React, { useState } from 'react';
import { formatInr, formatKwh } from '../../utils/energyMath';

interface DataPoint {
  label: string;
  consumptionKwh: number;
  costInr?: number;
  isPeak?: boolean;
}

interface AreaConsumptionChartProps {
  data: DataPoint[];
  height?: number;
  baselineKwh?: number;
  title?: string;
}

export const AreaConsumptionChart: React.FC<AreaConsumptionChartProps> = ({
  data,
  height = 240,
  baselineKwh,
  title,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 text-sm text-slate-400">
        No energy consumption data available for this range.
      </div>
    );
  }

  const padding = { top: 20, right: 24, bottom: 36, left: 48 };
  const width = 800; // SVG viewBox coordinate width
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.consumptionKwh), (baselineKwh || 0) * 1.2, 10);
  const minVal = 0;

  const getX = (index: number) => {
    if (data.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
  };

  const points = data.map((d, i) => `${getX(i)},${getY(d.consumptionKwh)}`).join(' ');
  const areaPoints = `${getX(0)},${padding.top + chartHeight} ${points} ${getX(data.length - 1)},${padding.top + chartHeight}`;

  const baselineY = baselineKwh ? getY(baselineKwh) : null;

  // Selected hover point
  const activePoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null;

  return (
    <div className="relative w-full rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-sm">
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span> Consumption (kWh)
            </span>
            {baselineKwh && (
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-3 bg-purple-400"></span> Target Baseline
              </span>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#818cf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + chartHeight * (1 - pct);
            const val = minVal + (maxVal - minVal) * pct;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="end"
                  className="font-mono tabular-nums"
                >
                  {Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* Baseline reference line */}
          {baselineY !== null && (
            <line
              x1={padding.left}
              y1={baselineY}
              x2={width - padding.right}
              y2={baselineY}
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Area fill */}
          <polygon points={areaPoints} fill="url(#areaGradient)" />

          {/* Primary Trend Line */}
          <polyline
            points={points}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover interactive bars / points */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.consumptionKwh);
            const isHovered = hoverIndex === i;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              >
                {/* Transparent hit area */}
                <rect
                  x={x - chartWidth / (data.length * 2)}
                  y={padding.top}
                  width={chartWidth / data.length}
                  height={chartHeight}
                  fill="transparent"
                />

                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + chartHeight}
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                    <circle cx={x} cy={y} r="5" fill="#38bdf8" stroke="#090e1c" strokeWidth="2.5" />
                  </>
                )}
              </g>
            );
          })}

          {/* X axis labels (sparse) */}
          {data.map((d, i) => {
            const step = Math.max(1, Math.floor(data.length / 7));
            if (i % step !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={i}
                x={getX(i)}
                y={height - 10}
                fill="#64748b"
                fontSize="10"
                textAnchor="middle"
                className="font-mono select-none"
              >
                {d.label}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activePoint && hoverIndex !== null && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border border-slate-700 bg-slate-950/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md transition-all"
            style={{
              left: `${Math.min(85, Math.max(15, (getX(hoverIndex) / width) * 100))}%`,
              top: '12px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-semibold text-slate-200">{activePoint.label}</div>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-mono text-cyan-400 tabular-nums">
                {formatKwh(activePoint.consumptionKwh)}
              </span>
              {activePoint.costInr !== undefined && (
                <span className="font-mono text-emerald-400 tabular-nums">
                  {formatInr(activePoint.costInr)}
                </span>
              )}
            </div>
            {activePoint.isPeak && (
              <div className="mt-1 text-[10px] text-amber-400 font-medium">⚡ Peak Tariff Window</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface BarComparisonChartProps {
  data: { label: string; value: number; secondaryValue?: number; color?: string }[];
  unit?: string;
  title?: string;
  height?: number;
}

export const BarComparisonChart: React.FC<BarComparisonChartProps> = ({
  data,
  unit = 'kWh',
  title,
}) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-sm">
      {title && <h4 className="mb-4 text-sm font-semibold text-slate-200">{title}</h4>}
      <div className="space-y-3">
        {data.map((item, idx) => {
          const pct = Math.min(100, Math.max(5, (item.value / maxVal) * 100));
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">{item.label}</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {item.value.toLocaleString()} {unit}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: item.color
                      ? item.color
                      : 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface DonutEfficiencyProps {
  score: number; // 0 - 100
  size?: number;
  label?: string;
}

export const DonutEfficiency: React.FC<DonutEfficiencyProps> = ({
  score,
  size = 120,
  label = 'Efficiency Score',
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const color =
    score >= 88 ? '#10b981' : score >= 75 ? '#38bdf8' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
            {score}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Rating</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium text-slate-300">{label}</span>
    </div>
  );
};
