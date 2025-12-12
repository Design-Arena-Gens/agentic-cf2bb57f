import type { ResourceStatus } from "@/lib/defaultItems";
import clsx from "clsx";

const STATUS_OPTIONS: { value: ResourceStatus | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "available", label: "可领取" },
  { value: "reserved", label: "已预留" },
  { value: "claimed", label: "已领取" }
];

interface FiltersProps {
  currentStatus: ResourceStatus | "all";
  onStatusChange: (status: ResourceStatus | "all") => void;
  searchValue: string;
  onSearchChange: (search: string) => void;
}

export function Filters({
  currentStatus,
  onStatusChange,
  searchValue,
  onSearchChange
}: FiltersProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={clsx(
              "group relative overflow-hidden rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
              currentStatus === option.value
                ? "border-brand-primary/80 bg-brand-muted/10 text-brand-primary"
                : "border-white/10 bg-slate-900 text-slate-400 hover:border-white/40 hover:text-slate-100"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <label className="relative flex items-center">
        <span className="sr-only">搜索物资</span>
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="搜索物资 / 领取人..."
          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus-visible:border-brand-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 md:w-64"
        />
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-3 h-4 w-4 text-slate-500"
        >
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.57-4.23 6.5 6.5 0 1 0-6.5 6.5 6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5s4.5 2.01 4.5 4.5S11.99 14 9.5 14"
          />
        </svg>
      </label>
    </section>
  );
}
