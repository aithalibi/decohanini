import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: ReactNode;
  value: number | string;
  subtitle?: ReactNode;
  icon: LucideIcon;
  color?: 'red' | 'black' | 'green' | 'orange';
}

const colorMap = {
  red: { bg: 'bg-brand-beige', icon: 'bg-brand-caramel text-white', value: 'text-brand-brown' },
  black: { bg: 'bg-brand-white', icon: 'bg-brand-espresso text-brand-cream', value: 'text-brand-espresso' },
  green: { bg: 'bg-green-50', icon: 'bg-green-700 text-white', value: 'text-green-800' },
  orange: { bg: 'bg-amber-50', icon: 'bg-amber-600 text-white', value: 'text-amber-700' },
};

export default function DashboardCard({ title, value, subtitle, icon: Icon, color = 'black' }: DashboardCardProps) {
  const colors = colorMap[color];
  return (
    <div className={`${colors.bg} flex items-start gap-3 rounded-[20px] border border-brand-sand p-4 shadow-[0_8px_24px_rgba(68,47,35,0.05)] sm:gap-4 sm:p-5`}>
      <div className={`${colors.icon} grid h-11 w-11 shrink-0 place-items-center rounded-xl sm:h-12 sm:w-12`}><Icon size={22} /></div>
      <div className="min-w-0"><p className="truncate text-xs font-medium text-brand-gray-text sm:text-sm">{title}</p><p className={`mt-0.5 text-2xl font-bold sm:text-3xl ${colors.value}`}>{value}</p>{subtitle && <p className="mt-1 text-[10px] text-brand-gray-text sm:text-xs">{subtitle}</p>}</div>
    </div>
  );
}
