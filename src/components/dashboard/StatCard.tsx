import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
  accent?: boolean;
}

export default function StatCard({ icon: Icon, label, value, sublabel, trend, accent }: StatCardProps) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend?.direction === 'up' ? 'text-green-400' : trend?.direction === 'down' ? 'text-red-400' : 'text-ink-400';

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ? 'bg-accent-600/15 text-accent-500' : 'bg-axis-700 text-ink-300'}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-ink-100 tabular-nums">{value}</p>
        <p className="text-sm font-medium text-ink-200 mt-1">{label}</p>
        {sublabel && <p className="text-xs text-ink-400 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}
