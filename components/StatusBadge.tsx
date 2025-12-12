import type { ResourceStatus } from "@/lib/defaultItems";
import clsx from "clsx";

const statusConfig: Record<
  ResourceStatus,
  { label: string; className: string }
> = {
  claimed: {
    label: "已领取",
    className: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/40"
  },
  reserved: {
    label: "已预留",
    className: "bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/40"
  },
  available: {
    label: "可领取",
    className: "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/40"
  }
};

interface StatusBadgeProps {
  status: ResourceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = statusConfig[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition",
        className
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
