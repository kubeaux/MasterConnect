import { cn } from "@/src/lib/utils";
import { Circle } from "lucide-react";

interface CampaignStatusBadgeProps {
  status: "OUVERTE" | "VERROUILLEE" | "PUBLIEE";
}

const statusConfig = {
  OUVERTE: {
    label: "Ouverte",
    color: "text-green-700 bg-green-50 border-green-200",
    dot: "text-green-500",
  },
  VERROUILLEE: {
    label: "Verrouillée",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    dot: "text-yellow-500",
  },
  PUBLIEE: {
    label: "Publiée",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    dot: "text-blue-500",
  },
};

export default function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
        config.color
      )}
    >
      <Circle className={cn("w-2 h-2 fill-current", config.dot)} />
      {config.label}
    </span>
  );
}