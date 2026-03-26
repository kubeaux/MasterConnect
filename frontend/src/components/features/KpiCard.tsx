import { cn } from "@/src/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "yellow" | "red";
}

const colorMap = {
  blue:   "bg-blue-50 text-blue-600",
  green:  "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  red:    "bg-red-50 text-red-600",
};

export default function KpiCard({ title, value, icon: Icon, color }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-5">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-heading font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}