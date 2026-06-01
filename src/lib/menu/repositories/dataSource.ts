import {
  createServerSupabaseClient,
  isSupabaseConfigured,
  supabaseProjectHost,
} from "@/src/lib/supabase/server";

export type DataSourceStatus = "supabase" | "mock";

export type DataSourceDiagnostics = {
  status: DataSourceStatus;
  envConfigured: boolean;
  projectHost?: string;
  checkedTable: string;
  queryAttempted: string;
  rowCount?: number;
  errorCode?: string;
  errorMessage?: string;
  errorDetails?: string;
  errorHint?: string;
};

export async function getDataSourceDiagnostics(): Promise<DataSourceDiagnostics> {
  const checkedTable = "menu_categories";
  const queryAttempted = "select id from menu_categories limit 1";
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return {
      status: "mock",
      envConfigured: isSupabaseConfigured,
      projectHost: supabaseProjectHost,
      checkedTable,
      queryAttempted,
      errorMessage: "Supabase URL or anon key is missing.",
    };
  }

  const { data, error } = await supabase
    .from(checkedTable)
    .select("id")
    .limit(1);

  if (error) {
    console.warn("[Pinoc data source] Supabase probe failed", {
      checkedTable,
      queryAttempted,
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      projectHost: supabaseProjectHost,
    });

    return {
      status: "mock",
      envConfigured: isSupabaseConfigured,
      projectHost: supabaseProjectHost,
      checkedTable,
      queryAttempted,
      errorCode: error.code,
      errorMessage: error.message,
      errorDetails: error.details,
      errorHint: error.hint,
    };
  }

  return {
    status: "supabase",
    envConfigured: isSupabaseConfigured,
    projectHost: supabaseProjectHost,
    checkedTable,
    queryAttempted,
    rowCount: data?.length ?? 0,
  };
}

export async function getDataSourceStatus(): Promise<DataSourceStatus> {
  const diagnostics = await getDataSourceDiagnostics();

  return diagnostics.status;
}
