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

  return (
    <span
      title={debugLabel}
      className={
        isConnected
          ? "inline-flex min-h-8 items-center justify-center rounded-full border border-[#2b1a12]/12 bg-[#2b1a12] px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fff8ed]"
          : "inline-flex min-h-8 items-center justify-center rounded-full border border-[#3d2618]/12 bg-[#f6efe6]/76 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7d4d2f]"
      }
    >
      {isConnected ? "Connected to Supabase" : "Using Mock Data"}
    </span>
  );
}
