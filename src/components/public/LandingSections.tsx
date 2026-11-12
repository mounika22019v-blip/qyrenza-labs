import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Shield,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  Lock,
  Globe2,
  Mail,
  UserCheck,
  Building,
  GraduationCap,
  Store,
  Hotel,
  Compass,
  Upload,
  User,
} from 'lucide-react';
import { AreaConsumptionChart, DonutEfficiency } from '../charts/EnergyCharts';

interface LandingProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onNavigateToDashboard: () => void;
}

export const HeroSection: React.FC<LandingProps> = ({ onOpenAuth, onNavigateToDashboard }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-600/20 via-indigo-600/15 to-transparent blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-medium text-cyan-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Next-Generation Energy Intelligence</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
            Intelligent Energy Management for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Smarter Buildings.
            </span>
          </h1>

          <p className="text-base text-slate-300 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Monitor electricity consumption, identify energy wastage, detect unusual usage, and optimize
            electricity costs with intelligent analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#solution"
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-700/80 transition-all cursor-pointer shadow-sm"
            >
              Explore Our Solution
            </a>
            <button
              onClick={onNavigateToDashboard}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition-all cursor-pointer"
            >
              Access Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl border border-slate-700/70 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl">
          <div className="relative overflow-hidden rounded-xl border border-slate-800">
            <img
              src="/src/assets/images/hero_energy_intelligence_1794064251732.jpg"
              alt="Qyrenza Labs Energy Intelligence Campus Visualization"
              className="w-full h-auto max-h-[460px] object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlay live telemetry badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto rounded-xl border border-slate-800/90 bg-slate-950/85 p-3 backdrop-blur-md">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Active Campus</span>
                  <div className="font-semibold text-slate-100">Qyrenza Demo Campus</div>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Total Consumption</span>
                  <div className="font-mono font-bold text-cyan-400 tabular-nums">48,920 kWh</div>
                </div>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Efficiency Rating</span>
                  <div className="font-mono font-bold text-emerald-400 tabular-nums">91.4% (Optimal)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 border-t border-slate-800/60 bg-gradient-to-b from-[#060913] to-[#090e1c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">About Qyrenza Labs</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Building Intelligent Solutions for Real-World Challenges.
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              Qyrenza Labs is a technology-driven startup developing intelligent and practical solutions that improve
              operational efficiency and sustainability.
            </p>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              We combine software engineering, cybersecurity, artificial intelligence, and data analytics to solve
              meaningful organizational challenges. From university campuses to commercial office complexes, our
              mission is to turn complex sensor feeds into proactive conservation and cost savings.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <Shield className="h-5 w-5 text-cyan-400" />
                <h4 className="mt-2 text-sm font-semibold text-slate-200">Cybersecurity Core</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Built from the ground up with strict data isolation, encrypted telemetry, and verified audit trails.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <Cpu className="h-5 w-5 text-purple-400" />
                <h4 className="mt-2 text-sm font-semibold text-slate-200">Software & AI Precision</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Statistical anomaly algorithms that isolate wasteful equipment runs and load spikes in real time.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              Organizational Pillars
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-mono text-sm font-bold">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Intelligent Telemetry Integration</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Seamless architecture for IoT power meters, Modbus RTU/TCP bridges, and campus sub-meter networks.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-mono text-sm font-bold">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Actionable Anomaly Detection</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Zero guesswork: pinpoint exactly which chiller, pump, or floor exceeded expected baselines.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 font-mono text-sm font-bold">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Measurable Cost Reduction</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Dynamic tariff calculations in Indian Rupees (₹) with peak load shifting recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      title: 'Unclear Electricity Consumption',
      desc: 'Monthly aggregate bills arrive weeks late without hourly resolution, leaving administrators blind to root causes.',
    },
    {
      title: 'Hidden Energy Wastage',
      desc: 'Air conditioning and high-draw equipment running 24/7 in unoccupied auditoriums, labs, and office wings.',
    },
    {
      title: 'Unexpected Consumption Spikes',
      desc: 'Sudden surges trigger heavy maximum demand utility penalties without early warning indicators.',
    },
    {
      title: 'Rising Electricity Costs',
      desc: 'Commercial and institutional tariffs continue to climb, stressing operational annual budgets.',
    },
    {
      title: 'Inefficient Equipment',
      desc: 'Degraded chillers, stuck ventilation dampers, and faulty pumps draw 2x to 4x baseline electricity unaddressed.',
    },
    {
      title: 'Lack of Actionable Insights',
      desc: 'Facility managers lack unified tools to translate raw meter pulses into concrete maintenance steps.',
    },
  ];

  return (
    <section className="py-20 border-t border-slate-800/60 bg-[#060913]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">The Problem</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Energy Waste Is Invisible. Its Cost Is Not.
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Organizations lose 15% to 30% of their annual energy expenditures to undetected anomalies, misaligned schedules,
            and uncalibrated machinery.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-200">{p.title}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SolutionSection: React.FC = () => {
  const solutions = [
    {
      icon: Activity,
      title: 'Intelligent Energy Monitoring',
      desc: 'Real-time and granular sub-hourly readings mapped across buildings, floors, and specific circuits.',
    },
    {
      icon: BarChart3,
      title: 'Energy Analytics',
      desc: 'Trend analysis, week-over-week comparisons, peak-demand metrics, and baseload heatmaps.',
    },
    {
      icon: AlertTriangle,
      title: 'Anomaly Detection',
      desc: 'Rule-based statistical models flag unexpected night loads, sudden spikes, and threshold breaches.',
    },
    {
      icon: Lightbulb,
      title: 'Smart Efficiency Recommendations',
      desc: 'Prioritized operational suggestions with estimated kWh and INR (₹) monthly savings.',
    },
    {
      icon: Cpu,
      title: 'Device Management',
      desc: 'Comprehensive inventory for HVAC, Lighting, Pumps, IT infrastructure, and Laboratory gear.',
    },
    {
      icon: Building2,
      title: 'Building Management',
      desc: 'Multi-structure campus hierarchies, floor area normalization, and cross-facility benchmarks.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Reports and Insights',
      desc: 'Executive daily, weekly, and monthly PDF/print-ready summaries with instant CSV exports.',
    },
  ];

  return (
    <section id="solution" className="py-20 border-t border-slate-800/60 bg-gradient-to-b from-[#090e1c] to-[#060913]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Our Solution</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Qyrenza Energy Intelligence
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            An end-to-end intelligent energy management platform transforming passive power meters into active efficiency drivers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-100">{s.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Connect Energy Meters',
      desc: 'Deploy smart meters or link existing Modbus / IoT gateways via secure REST, MQTT, or bulk import.',
    },
    {
      step: '02',
      title: 'Monitor Electricity Consumption',
      desc: 'Continuous real-time telemetry streaming into centralized organization dashboards.',
    },
    {
      step: '03',
      title: 'Analyze Consumption Patterns',
      desc: 'Statistical baseline algorithms evaluate peak demand, idle loads, and unexpected surges.',
    },
    {
      step: '04',
      title: 'Optimize Energy Efficiency',
      desc: 'Execute prioritized recommendations, calibrate HVAC schedules, and lock in recurring cost savings.',
    },
  ];

  return (
    <section id="features" className="py-20 border-t border-slate-800/60 bg-[#060913]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Simple 4-Step Process</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            How Qyrenza Intelligence Works
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            From sensor connectivity to bottom-line utility reductions in four clear operational stages.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => (
            <div key={idx} className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <span className="font-mono text-3xl font-extrabold text-cyan-400/80">{st.step}</span>
              <h3 className="mt-3 text-base font-semibold text-slate-100">{st.title}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const DashboardPreviewSection: React.FC<LandingProps> = ({ onNavigateToDashboard }) => {
  const sampleChartData = [
    { label: '00:00', consumptionKwh: 14.2, costInr: 120.7 },
    { label: '04:00', consumptionKwh: 12.8, costInr: 108.8 },
    { label: '08:00', consumptionKwh: 34.5, costInr: 293.2 },
    { label: '12:00', consumptionKwh: 68.4, costInr: 726.7, isPeak: true },
    { label: '16:00', consumptionKwh: 62.1, costInr: 659.8, isPeak: true },
    { label: '20:00', consumptionKwh: 28.6, costInr: 243.1 },
    { label: '23:00', consumptionKwh: 16.5, costInr: 140.2 },
  ];

  return (
    <section className="py-20 border-t border-slate-800/60 bg-gradient-to-b from-[#060913] to-[#090e1c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Live Interface Preview</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              High-Precision Energy Control Room
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Interactive preview showing real-time consumption, tariffs, and anomaly alerts.
            </p>
          </div>
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-2 self-start md:self-auto rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-cyan-400 transition-colors"
          >
            Launch Full Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dashboard Preview Surface */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
          {/* Top Metric Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-850 bg-slate-900/60 p-4">
              <span className="text-xs text-slate-400">Total Consumption</span>
              <div className="mt-1 font-mono text-2xl font-bold text-white tabular-nums">48,920 kWh</div>
              <span className="text-[11px] text-emerald-400 font-medium">↓ 6.4% vs last period</span>
            </div>
            <div className="rounded-xl border border-slate-850 bg-slate-900/60 p-4">
              <span className="text-xs text-slate-400">Estimated Cost</span>
              <div className="mt-1 font-mono text-2xl font-bold text-white tabular-nums">₹4,32,540</div>
              <span className="text-[11px] text-slate-400">Base Tariff: ₹8.50/kWh</span>
            </div>
            <div className="rounded-xl border border-slate-850 bg-slate-900/60 p-4">
              <span className="text-xs text-slate-400">Energy Saved</span>
              <div className="mt-1 font-mono text-2xl font-bold text-cyan-400 tabular-nums">3,860 kWh</div>
              <span className="text-[11px] text-cyan-300 font-medium">~ ₹32,810 saved</span>
            </div>
            <div className="rounded-xl border border-slate-850 bg-slate-900/60 p-4">
              <span className="text-xs text-slate-400">Campus Efficiency</span>
              <div className="mt-1 font-mono text-2xl font-bold text-emerald-400 tabular-nums">91.4%</div>
              <span className="text-[11px] text-emerald-300">Optimal Operating Range</span>
            </div>
          </div>

          {/* Interactive Chart Preview */}
          <div className="mt-6">
            <AreaConsumptionChart
              data={sampleChartData}
              baselineKwh={35}
              title="Campus Hourly Load Profile (kWh) — Today vs Baseline"
              height={220}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const WhyQyrenzaSection: React.FC = () => {
  const points = [
    {
      title: 'Intelligent Insights',
      desc: 'Machine-driven classification isolates true hardware anomalies from benign operational shifts.',
    },
    {
      title: 'Data-Driven Decisions',
      desc: 'Eliminate subjective guesswork with verified sub-meter logs and historical baseload benchmarks.',
    },
    {
      title: 'Sustainable Operations',
      desc: 'Directly lower your organization’s carbon footprint by trimming continuous phantom kilowatt loads.',
    },
    {
      title: 'Energy Transparency',
      desc: 'Complete cost and consumption visibility accessible to administrators, facility heads, and finance teams.',
    },
  ];

  return (
    <section className="py-20 border-t border-slate-800/60 bg-[#060913]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Why Qyrenza Labs</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Engineered for Modern Enterprise Reliability
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Built by engineers who understand both cybersecurity compliance and large-scale software systems.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <CheckCircle2 className="h-6 w-6 text-cyan-400 mb-3" />
              <h3 className="text-base font-semibold text-slate-100">{p.title}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const VisionSection: React.FC = () => {
  const targets = [
    { icon: GraduationCap, name: 'Educational Institutions', desc: 'Universities, colleges, research institutes' },
    { icon: Building, name: 'Commercial Offices', desc: 'Corporate headquarters, IT tech parks' },
    { icon: Layers, name: 'Facility Managers', desc: 'Operations heads, mechanical engineers' },
    { icon: Compass, name: 'Campus Administrators', desc: 'Institutional bursars and directors' },
    { icon: Hotel, name: 'Hostels & Residences', desc: 'Student dormitories, residential wings' },
    { icon: Store, name: 'Small Businesses', desc: 'Retail chains, commercial showrooms' },
  ];

  return (
    <section id="vision" className="py-20 border-t border-slate-800/60 bg-gradient-to-b from-[#090e1c] to-[#060913]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Our Vision</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Building a Smarter and More Sustainable Future.
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Our vision is to make intelligent energy management accessible, practical, and impactful for organizations of every size.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {targets.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-2">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-semibold text-slate-200">{t.name}</h4>
                <p className="mt-1 text-[11px] text-slate-400">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const FoundersSection: React.FC = () => {
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="founders" className="py-24 border-t border-slate-800/60 bg-[#060913]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Leadership & Vision</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
            Meet Our Founders
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Leading the convergence of cybersecurity, systems engineering, and practical energy sustainability.
          </p>
        </div>

        {/* Two cards side by side on desktop, stacked on mobile, equal prominence */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Founder 1 */}
          <div className="group relative rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-[#090e1c] p-8 text-center shadow-xl backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
            {/* Circular Photo Placeholder with Upload */}
            <div className="relative mx-auto h-32 w-32 rounded-full p-1 bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <div className="relative h-full w-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
                {photo1 ? (
                  <img src={photo1} alt="Nama Mounika" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <User className="h-12 w-12 text-cyan-400" />
                    <span className="text-[10px] font-mono text-slate-400">NM</span>
                  </div>
                )}
                {/* Upload action overlay */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] cursor-pointer transition-opacity">
                  <Upload className="h-4 w-4 mb-1" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, setPhoto1)}
                  />
                </label>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold tracking-tight text-white">NAMA MOUNIKA</h3>
              <p className="mt-1 text-sm font-semibold text-cyan-400">Co-Founder</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-xs font-medium text-cyan-200">
                <Shield className="h-3 w-3 text-cyan-400" />
                Cybersecurity & Technology
              </div>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="group relative rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-[#090e1c] p-8 text-center shadow-xl backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-300">
            {/* Circular Photo Placeholder with Upload */}
            <div className="relative mx-auto h-32 w-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20">
              <div className="relative h-full w-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
                {photo2 ? (
                  <img src={photo2} alt="Medapati Madhulika Reddy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <User className="h-12 w-12 text-purple-400" />
                    <span className="text-[10px] font-mono text-slate-400">MMR</span>
                  </div>
                )}
                {/* Upload action overlay */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] cursor-pointer transition-opacity">
                  <Upload className="h-4 w-4 mb-1" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, setPhoto2)}
                  />
                </label>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold tracking-tight text-white">MEDAPATI MADHULIKA REDDY</h3>
              <p className="mt-1 text-sm font-semibold text-purple-400">Co-Founder</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-950/40 px-3 py-1 text-xs font-medium text-purple-200">
                <Cpu className="h-3 w-3 text-purple-400" />
                Software & Product
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatus('error');
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!form.email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!form.organization.trim()) {
      setStatus('error');
      setErrorMessage('Please specify your organization.');
      return;
    }
    if (!form.message.trim()) {
      setStatus('error');
      setErrorMessage('Please enter a brief message regarding your requirements.');
      return;
    }

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', organization: '', message: '' });
    }, 600);
  };

  return (
    <section id="contact" className="py-20 border-t border-slate-800/60 bg-gradient-to-b from-[#060913] to-[#090e1c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Get in Touch</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Let's Build a Smarter Future Together.
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Whether you represent an educational institution, enterprise tech park, hostel facility, or commercial property,
              our engineering team is ready to assist your energy transition.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Direct Inquiries</span>
                  <a href="mailto:n7282433@gmail.com" className="font-mono text-cyan-300 hover:underline">
                    n7282433@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Platform Security & Verification</span>
                  <span className="text-xs text-slate-300">Encrypted transmission & enterprise data isolation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Working Contact Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 shadow-xl">
            {status === 'success' ? (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">Message Received</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you for reaching out to Qyrenza Labs. Our team will review your organization details and reply to
                  you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@organization.edu"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Organization Name</label>
                    <input
                      type="text"
                      required
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      placeholder="e.g. Apex Tech Campus"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Message / Requirements</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your facilities, current meter setups, and energy management goals..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Submitting Inquiry...' : 'Send Inquiry to Qyrenza Labs'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const PublicFooter: React.FC<LandingProps> = ({ onNavigateToDashboard }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#04060d] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-wider text-white">QYRENZA LABS</span>
              <p className="text-xs text-slate-400">Intelligent Technology. Sustainable Tomorrow.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#hero" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#solution" className="hover:text-cyan-400 transition-colors">Solutions</a>
            <button onClick={onNavigateToDashboard} className="hover:text-cyan-400 transition-colors cursor-pointer">Dashboard</button>
            <a href="#founders" className="hover:text-cyan-400 transition-colors">Founders</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
            <span className="text-slate-600">|</span>
            <a href="mailto:n7282433@gmail.com" className="text-cyan-300 font-mono hover:underline">n7282433@gmail.com</a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Qyrenza Labs. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
