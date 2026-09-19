import { useState, useEffect } from 'react';
import {
  Gauge, Cpu, MemoryStick, Activity, Clock, PieChart as PieIcon,
  TrendingUp, AlertTriangle, Info, Lightbulb, Play, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import PageHeader, { FilterDropdown } from '@/components/dashboard/PageHeader';
import LoadingState from '@/components/dashboard/LoadingState';
import { useToast } from '@/context/ToastContext';
import { getOptimizationInsights, getCapacityScenarios, getOptimizationOpportunities } from '@/api/apiClient';
import {
  utilizationTrend7d, queueTimeTrend, runtimeTrend, memoryVsCompute, capacityDistribution,
} from '@/data/mockData';
import type { OptimizationOpportunity } from '@/data/mockData';

const chartTooltipStyle = {
  backgroundColor: '#181C25',
  border: '1px solid #242A35',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#D9D9D9',
};

const dateRanges = ['Last 24 hours', 'Last 7 days', 'Last 30 days'];

const clusterOptions = [
  { value: 'Cluster Alpha', label: 'Cluster Alpha' },
  { value: 'Cluster Beta', label: 'Cluster Beta' },
  { value: 'Cluster Gamma', label: 'Cluster Gamma' },
  { value: 'Cluster Delta', label: 'Cluster Delta' },
];
const gpuTypeOptions = [
  { value: 'NVIDIA H100', label: 'NVIDIA H100' },
  { value: 'NVIDIA A100', label: 'NVIDIA A100' },
  { value: 'NVIDIA L40S', label: 'NVIDIA L40S' },
];
const workloadTypeOptions = [
  { value: 'Training', label: 'Training' },
  { value: 'Inference', label: 'Inference' },
  { value: 'Batch', label: 'Batch' },
  { value: 'Research', label: 'Research' },
];
const teamOptions = [
  { value: 'ML Platform', label: 'ML Platform' },
  { value: 'Research Team', label: 'Research Team' },
  { value: 'MLOps', label: 'MLOps' },
  { value: 'Data Science', label: 'Data Science' },
];

const severityIcons: Record<string, typeof AlertTriangle> = {
  Critical: AlertTriangle,
  Warning: AlertTriangle,
  Info: Info,
};

const severityColors: Record<string, string> = {
  Critical: 'text-red-400 bg-red-500/10',
  Warning: 'text-amber-400 bg-amber-500/10',
  Info: 'text-blue-400 bg-blue-500/10',
};

export default function Optimization() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<ReturnType<typeof getOptimizationInsights> extends Promise<infer T> ? T : never>(null as never);
  const [opportunities, setOpportunities] = useState<OptimizationOpportunity[]>([]);
  const [dateRange, setDateRange] = useState('Last 7 days');
  const [clusterFilter, setClusterFilter] = useState('');
  const [gpuFilter, setGpuFilter] = useState('');
  const [workloadFilter, setWorkloadFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [scenario, setScenario] = useState({
    additionalDemand: '200',
    workloadIncrease: '15',
    horizon: '30 days',
    targetUtilization: '80',
  });
  const [scenarioResult, setScenarioResult] = useState<null | {
    projectedDemand: number;
    estimatedCapacityGap: number;
    potentialAllocationPressure: string;
    scenarioStatus: string;
  }>(null);
  const [runningScenario, setRunningScenario] = useState(false);

  useEffect(() => {
    (async () => {
      const [data, opps] = await Promise.all([getOptimizationInsights(), getOptimizationOpportunities()]);
      setInsights(data as never);
      setOpportunities(opps);
      setLoading(false);
    })();
  }, []);

  const runScenario = async () => {
    setRunningScenario(true);
    try {
      const result = await getCapacityScenarios({
        additionalDemand: Number(scenario.additionalDemand),
        workloadIncrease: Number(scenario.workloadIncrease),
        horizon: scenario.horizon,
        targetUtilization: Number(scenario.targetUtilization),
      });
      setScenarioResult(result);
      toast('Scenario calculation completed.', 'success');
    } catch {
      toast('Failed to run scenario.', 'error');
    } finally {
      setRunningScenario(false);
    }
  };

  if (loading) return <LoadingState message="Loading optimization insights..." />;

  const cards = insights.cards;

  return (
    <div>
      <PageHeader
        title="Optimization Insight"
        subtitle="Understand utilization, idle capacity, queue pressure and resource fragmentation."
        actions={
          <div className="flex items-center gap-2">
            {dateRanges.map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  dateRange === range ? 'bg-accent-600/15 text-accent-500 border border-accent-600/30' : 'text-ink-300 hover:text-ink-100 hover:bg-axis-800 border border-transparent'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FilterDropdown label="Cluster" value={clusterFilter} onChange={setClusterFilter} options={clusterOptions} />
        <FilterDropdown label="GPU Type" value={gpuFilter} onChange={setGpuFilter} options={gpuTypeOptions} />
        <FilterDropdown label="Workload Type" value={workloadFilter} onChange={setWorkloadFilter} options={workloadTypeOptions} />
        <FilterDropdown label="Team" value={teamFilter} onChange={setTeamFilter} options={teamOptions} />
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard icon={Gauge} label="GPU Utilization" value={`${cards.gpuUtilization}%`} accent />
        <StatCard icon={Cpu} label="Idle Capacity" value={`${cards.idleCapacity}%`} trend={{ value: '-1.2%', direction: 'down' }} />
        <StatCard icon={MemoryStick} label="Memory Pressure" value={cards.memoryPressure} />
        <StatCard icon={Activity} label="Compute Pressure" value={cards.computePressure} />
        <StatCard icon={Clock} label="Queue Pressure" value={cards.queuePressure} />
        <StatCard icon={PieIcon} label="Fragmented Capacity" value={`${cards.fragmentedCapacity}%`} trend={{ value: '+0.8%', direction: 'up' }} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Utilization Trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-100 mb-1">Utilization Trend</h3>
          <p className="text-xs text-ink-400 mb-4">{dateRange}</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={utilizationTrend7d}>
              <defs>
                <linearGradient id="utilTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#242A35" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#777C86', fontSize: 11 }} axisLine={{ stroke: '#242A35' }} tickLine={false} />
              <YAxis tick={{ fill: '#777C86', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="utilization" stroke="#FF6B35" strokeWidth={2} fill="url(#utilTrendGrad)" name="Utilization" />
              <Line type="monotone" dataKey="idle" stroke="#3B82F6" strokeWidth={1.5} dot={false} name="Idle" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Queue Time Trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-100 mb-1">Queue Time Trend</h3>
          <p className="text-xs text-ink-400 mb-4">Average wait time by queue (minutes)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={queueTimeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242A35" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#777C86', fontSize: 11 }} axisLine={{ stroke: '#242A35' }} tickLine={false} />
              <YAxis tick={{ fill: '#777C86', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#777C86' }} />
              <Line type="monotone" dataKey="priority" stroke="#FF6B35" strokeWidth={2} dot={false} name="Priority Queue" />
              <Line type="monotone" dataKey="standard" stroke="#3B82F6" strokeWidth={2} dot={false} name="Standard Queue" />
              <Line type="monotone" dataKey="research" stroke="#A855F7" strokeWidth={2} dot={false} name="Research Queue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Runtime Trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-100 mb-1">Runtime Trend</h3>
          <p className="text-xs text-ink-400 mb-4">Workload distribution by type</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={runtimeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242A35" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#777C86', fontSize: 11 }} axisLine={{ stroke: '#242A35' }} tickLine={false} />
              <YAxis tick={{ fill: '#777C86', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#242A3550' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#777C86' }} />
              <Bar dataKey="training" stackId="a" fill="#FF6B35" name="Training" />
              <Bar dataKey="inference" stackId="a" fill="#3B82F6" name="Inference" />
              <Bar dataKey="batch" stackId="a" fill="#22C55E" name="Batch" />
              <Bar dataKey="research" stackId="a" fill="#A855F7" name="Research" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Memory vs Compute + Capacity Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-100 mb-1">Memory vs Compute Pressure</h3>
          <p className="text-xs text-ink-400 mb-4">Resource pressure comparison</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={memoryVsCompute}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242A35" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#777C86', fontSize: 11 }} axisLine={{ stroke: '#242A35' }} tickLine={false} />
              <YAxis tick={{ fill: '#777C86', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="memory" stroke="#A855F7" strokeWidth={2} fill="#A855F720" name="Memory" />
              <Area type="monotone" dataKey="compute" stroke="#FF6B35" strokeWidth={2} fill="#FF6B3520" name="Compute" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-axis-700">
            <p className="text-xs text-ink-400 mb-2">Capacity Allocation Distribution</p>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={capacityDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2}>
                  {capacityDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="#181C25" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#777C86' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Optimization Opportunities */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-ink-100 mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent-500" />
          Optimization Opportunities
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {opportunities.map((opp) => {
            const Icon = severityIcons[opp.severity] || Info;
            return (
              <div key={opp.id} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${severityColors[opp.severity] || 'text-ink-400 bg-axis-700'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-ink-100">{opp.title}</h4>
                      <StatusBadge status={opp.status} size="sm" />
                    </div>
                    <p className="text-sm text-ink-400 mt-1">{opp.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-ink-500">Affected: <span className="text-ink-300">{opp.affected}</span></p>
                      <button
                        onClick={() => toast(`Details for "${opp.title}" would open here.`, 'info')}
                        className="text-xs text-accent-500 hover:text-accent-400 flex items-center gap-1"
                      >
                        View Details <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capacity Planning Scenario */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent-500" />
          <h3 className="text-base font-semibold text-ink-100">Capacity Planning Scenario</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-ink-400 mb-4">Configure parameters and run a mock scenario to project capacity demand.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-200 mb-1.5">Additional GPU Demand</label>
                <input type="number" value={scenario.additionalDemand} onChange={(e) => setScenario({ ...scenario, additionalDemand: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-200 mb-1.5">Expected Workload Increase (%)</label>
                <input type="number" value={scenario.workloadIncrease} onChange={(e) => setScenario({ ...scenario, workloadIncrease: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-200 mb-1.5">Planning Horizon</label>
                <select value={scenario.horizon} onChange={(e) => setScenario({ ...scenario, horizon: e.target.value })} className="input-field cursor-pointer">
                  <option value="7 days">7 days</option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="180 days">180 days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-200 mb-1.5">Target Utilization (%)</label>
                <input type="number" value={scenario.targetUtilization} onChange={(e) => setScenario({ ...scenario, targetUtilization: e.target.value })} className="input-field" />
              </div>
            </div>
            <button onClick={runScenario} disabled={runningScenario} className="btn-primary mt-4">
              {runningScenario ? 'Running...' : 'Run Scenario'}
              <Play className="w-4 h-4" />
            </button>
          </div>

          <div>
            {scenarioResult ? (
              <div className="space-y-3">
                <div className="card p-4">
                  <p className="text-xs text-ink-400">Projected Demand</p>
                  <p className="text-2xl font-bold text-ink-100 tabular-nums mt-1">{scenarioResult.projectedDemand.toLocaleString()} GPUs</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="card p-4">
                    <p className="text-xs text-ink-400">Estimated Capacity Gap</p>
                    <p className="text-xl font-bold text-accent-500 tabular-nums mt-1">{scenarioResult.estimatedCapacityGap.toLocaleString()}</p>
                  </div>
                  <div className="card p-4">
                    <p className="text-xs text-ink-400">Allocation Pressure</p>
                    <p className="text-xl font-bold text-ink-100 mt-1">{scenarioResult.potentialAllocationPressure}</p>
                  </div>
                </div>
                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-ink-400">Scenario Status</p>
                    <StatusBadge status={scenarioResult.estimatedCapacityGap > 0 ? 'Warning' : 'Operational'} size="sm" />
                  </div>
                  <p className="text-sm font-medium text-ink-100 mt-2">{scenarioResult.scenarioStatus}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <TrendingUp className="w-10 h-10 text-ink-500 mb-3" />
                <p className="text-sm text-ink-400">Run a scenario to see projected capacity demand and potential gaps.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
