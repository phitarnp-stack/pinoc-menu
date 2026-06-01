import { getDataSourceDiagnostics } from "@/src/lib/menu/repositories";

export async function DataSourceIndicator() {
  const diagnostics = await getDataSourceDiagnostics();
  const isConnected = diagnostics.status === "supabase";
  const debugLabel = isConnected
    ? `Connected to ${diagnostics.projectHost ?? "Supabase"}`
    : [
        diagnostics.envConfigured ? "Env configured" : "Env missing",
        diagnostics.errorCode,
        diagnostics.errorMessage,
      ]
        .filter(Boolean)
        .join(" | ");
  const diagnosticRows = [
    ["Env", diagnostics.envConfigured ? "present" : "missing"],
    ["Host", diagnostics.projectHost ?? "not available"],
    ["Query", diagnostics.queryAttempted],
    ["Code", diagnostics.errorCode ?? "none"],
    ["Message", diagnostics.errorMessage ?? "none"],
    ["Details", diagnostics.errorDetails ?? "none"],
    ["Hint", diagnostics.errorHint ?? "none"],
  ];

  return (
    <div className="grid gap-2">
      <span
        title={debugLabel}
        className={
          isConnected
            ? "inline-flex min-h-8 w-fit items-center justify-center rounded-full border border-[#2b1a12]/12 bg-[#2b1a12] px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fff8ed]"
            : "inline-flex min-h-8 w-fit items-center justify-center rounded-full border border-[#3d2618]/12 bg-[#f6efe6]/76 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7d4d2f]"
        }
      >
        {isConnected ? "Connected to Supabase" : "Using Mock Data"}
      </span>

      <div className="max-w-[20rem] rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/78 p-3 text-[11px] leading-5 text-[#5f4635] shadow-[0_10px_24px_rgba(84,55,34,0.1)] sm:max-w-[28rem]">
        <p className="font-semibold uppercase tracking-[0.16em] text-[#7d4d2f]">
          Supabase Diagnostic
        </p>
        <dl className="mt-2 grid gap-1">
          {diagnosticRows.map(([label, value]) => (
            <div key={label} className="grid gap-1 sm:grid-cols-[5rem_1fr]">
              <dt className="font-semibold text-[#241710]">{label}</dt>
              <dd className="break-words font-mono text-[10px]">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
