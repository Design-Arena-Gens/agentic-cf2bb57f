'use client';

import { useState } from "react";
import type { ResourceStatus } from "@/lib/defaultItems";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { ItemBoard } from "@/components/ItemBoard";

export default function Page() {
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "all">(
    "all"
  );
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 pb-16 pt-10">
        <Filters
          currentStatus={statusFilter}
          onStatusChange={setStatusFilter}
          searchValue={search}
          onSearchChange={setSearch}
        />
        <ItemBoard statusFilter={statusFilter} search={search} />
      </main>
      <footer className="border-t border-white/10 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        物资状态实时同步，减少沟通成本。保持信息透明，让每一次领取都可追踪。
      </footer>
    </div>
  );
}
