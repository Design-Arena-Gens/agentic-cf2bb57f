import { useEffect, useMemo, useState } from "react";
import type {
  ResourceItem,
  ResourceStatus
} from "@/lib/defaultItems";
import { defaultItems } from "@/lib/defaultItems";
import { StatusBadge } from "./StatusBadge";
import clsx from "clsx";

const STORAGE_KEY = "agentic-cf2bb57f-items";

function loadItems(): ResourceItem[] {
  if (typeof window === "undefined") return defaultItems;
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultItems;
    const parsed = JSON.parse(data) as ResourceItem[];
    return parsed.map((item) => ({
      ...item,
      updatedAt: item.updatedAt ?? new Date().toISOString()
    }));
  } catch {
    return defaultItems;
  }
}

export interface ItemBoardState {
  items: ResourceItem[];
  statusFilter: ResourceStatus | "all";
  search: string;
}

function persistItems(items: ResourceItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const statusPalette: Record<ResourceStatus, string> = {
  available: "ring-emerald-500/40 hover:ring-emerald-500/80",
  claimed: "ring-rose-500/40 hover:ring-rose-500/80",
  reserved: "ring-amber-500/40 hover:ring-amber-500/80"
};

export function ItemBoard({
  statusFilter,
  search
}: Pick<ItemBoardState, "statusFilter" | "search">) {
  const [items, setItems] = useState<ResourceItem[]>(() => loadItems());

  useEffect(() => {
    persistItems(items);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchStatus =
          statusFilter === "all" ? true : item.status === statusFilter;
        const normalizedSearch = search.trim().toLowerCase();
        if (!normalizedSearch) return matchStatus;
        const haystack = `${item.name} ${item.description ?? ""} ${
          item.owner ?? ""
        }`.toLowerCase();
        return matchStatus && haystack.includes(normalizedSearch);
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [items, search, statusFilter]);

  function toggleStatus(id: string, status: ResourceStatus) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
      )
    );
  }

  function updateOwner(id: string, owner: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, owner: owner || undefined, updatedAt: new Date().toISOString() }
          : item
      )
    );
  }

  function addItem(data: {
    name: string;
    description?: string;
    owner?: string;
    status: ResourceStatus;
  }) {
    setItems((current) => [
      {
        id: `item-${crypto.randomUUID()}`,
        name: data.name,
        description: data.description,
        owner: data.owner,
        status: data.status,
        updatedAt: new Date().toISOString()
      },
      ...current
    ]);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function exportCsv() {
    const header = ["名称", "状态", "领取人", "说明", "更新时间"];
    const rows = items.map((item) => [
      item.name,
      item.status === "available"
        ? "可领取"
        : item.status === "reserved"
          ? "已预留"
          : "已领取",
      item.owner ?? "",
      item.description ?? "",
      new Date(item.updatedAt).toLocaleString()
    ]);
    const csv = [header, ...rows]
      .map((columns) =>
        columns
          .map((column) =>
            `"${column.replaceAll('"', '""').replace(/\n/g, " ")}"`
          )
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `物资领取状态-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <AddItemDialog onCreate={addItem} />
        <button
          onClick={exportCsv}
          className="rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm transition hover:border-brand-primary/60 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          导出 CSV
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className={clsx(
              "group flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-lg ring-1 transition duration-200",
              statusPalette[item.status]
            )}
          >
            <header className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    {item.name}
                  </h2>
                  {item.description ? (
                    <p className="mt-1 text-sm text-slate-400">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <StatusBadge status={item.status} />
              </div>
              <OwnerInput owner={item.owner} onChange={(value) => updateOwner(item.id, value)} />
            </header>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <StatusPicker
                current={item.status}
                onChange={(status) => toggleStatus(item.id, status)}
              />
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <time suppressHydrationWarning>
                  {new Date(item.updatedAt).toLocaleString()}
                </time>
                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded-md border border-white/10 px-2 py-1 text-xs font-medium text-slate-400 transition hover:border-rose-500/60 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  删除
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-slate-950/40 p-10 text-center text-sm text-slate-400">
          暂无符合条件的物资记录。试试切换筛选或新增一条记录吧。
        </div>
      ) : null}
    </div>
  );
}

interface StatusPickerProps {
  current: ResourceStatus;
  onChange: (status: ResourceStatus) => void;
}

const STATUS_BUTTONS: { label: string; value: ResourceStatus }[] = [
  { label: "可领取", value: "available" },
  { label: "已预留", value: "reserved" },
  { label: "已领取", value: "claimed" }
];

function StatusPicker({ current, onChange }: StatusPickerProps) {
  return (
    <div className="flex gap-1">
      {STATUS_BUTTONS.map((status) => (
        <button
          key={status.value}
          onClick={() => onChange(status.value)}
          className={clsx(
            "rounded-md border px-2 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
            current === status.value
              ? "border-brand-primary/80 bg-brand-muted/10 text-brand-primary focus-visible:ring-brand-primary/70"
              : "border-white/10 bg-slate-900 text-slate-400 hover:border-white/40 hover:text-slate-100 focus-visible:ring-slate-500/50"
          )}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}

interface OwnerInputProps {
  owner?: string;
  onChange: (value: string) => void;
}

function OwnerInput({ owner, onChange }: OwnerInputProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-400">
      <span>领取人 / 负责人</span>
      <input
        value={owner ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="未记录"
        className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 shadow-inner placeholder:text-slate-500 focus-visible:border-brand-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
      />
    </label>
  );
}

interface AddItemDialogProps {
  onCreate: (item: {
    name: string;
    description?: string;
    owner?: string;
    status: ResourceStatus;
  }) => void;
}

function AddItemDialog({ onCreate }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState<ResourceStatus>("available");

  function resetForm() {
    setName("");
    setDescription("");
    setOwner("");
    setStatus("available");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      owner: owner.trim() || undefined,
      status
    });
    resetForm();
    setOpen(false);
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-brand-primary/50 bg-brand-primary/10 px-4 py-2 text-sm font-medium text-brand-primary transition hover:border-brand-primary hover:bg-brand-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        新增物资
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl"
          >
            <header>
              <h2 className="text-lg font-semibold text-slate-50">新增物资</h2>
              <p className="mt-1 text-sm text-slate-400">
                填写物资详情并设置初始状态，可随时再修改。
              </p>
            </header>

            <label className="flex flex-col gap-2 text-sm text-slate-300">
              名称
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="例如：折叠桌椅"
                className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:border-brand-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-300">
              说明
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="可选：存放位置、使用说明..."
                className="min-h-[90px] rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:border-brand-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-300">
              领取人 / 负责人
              <input
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                placeholder="可选"
                className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:border-brand-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-300">
              初始状态
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ResourceStatus)
                }
                className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-slate-100 focus-visible:border-brand-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
              >
                <option value="available">可领取</option>
                <option value="reserved">已预留</option>
                <option value="claimed">已领取</option>
              </select>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-white/40 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                取消
              </button>
              <button
                type="submit"
                className="rounded-lg border border-brand-primary/60 bg-brand-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
