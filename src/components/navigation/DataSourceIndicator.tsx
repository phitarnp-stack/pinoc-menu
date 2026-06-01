import { getDataSourceStatus } from "@/src/lib/menu/repositories";

export async function DataSourceIndicator() {
  const status = await getDataSourceStatus();
  const isConnected = status === "supabase";

  return (
    <span
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
