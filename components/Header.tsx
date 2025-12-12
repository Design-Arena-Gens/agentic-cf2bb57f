export function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-slate-100 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            领用状态面板
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            快速同步物资领取情况，避免重复领取或遗漏。支持根据状态筛选、记录领取人，确保大家随时掌握可用资源。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="rounded-md border border-white/10 px-3 py-1.5">
            随时更新
          </span>
          <span className="rounded-md border border-white/10 px-3 py-1.5">
            状态透明
          </span>
          <span className="rounded-md border border-white/10 px-3 py-1.5">
            支持导出
          </span>
        </div>
      </div>
    </header>
  );
}
