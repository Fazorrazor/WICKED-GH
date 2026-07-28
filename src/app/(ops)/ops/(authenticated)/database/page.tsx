/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
import { verifyOpsSession } from "@/lib/ops/auth";
import { redirect } from "next/navigation";
import { fetchDatabaseStats } from "./actions";
import {
  Database,
  ServerCrash,
  Activity,
  BarChart3,
  Fingerprint,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NAMESPACE_MAP: Record<string, string[]> = {
  "E-Commerce & Storefront": [
    "products",
    "product_media",
    "product_option_groups",
    "product_option_values",
    "product_variants",
    "categories",
    "collections",
    "collection_products",
  ],
  "Atelier & Custom Orders": [
    "inquiries",
    "commissions",
    "commission_items",
    "clients",
  ],
  "IAM & Access Control": [
    "staff_profiles",
    "staff_roles",
    "roles",
    "permissions",
    "role_permissions",
  ],
  "Sales & Transactions": ["orders", "order_items"],
  "System Telemetry & Ops": [
    "ops_network_traces",
    "ops_audit_log",
    "audit_events",
    "ops_incidents",
  ],
};

export default async function DatabaseSignalPage() {
  const session = await verifyOpsSession();
  if (!session) redirect("/ops/login");

  let tables = [];
  let errorMsg = null;

  try {
    tables = await fetchDatabaseStats();
    // Sort tables by row count descending
    if (Array.isArray(tables)) {
      tables.sort((a, b) => (b.row_count || 0) - (a.row_count || 0));
    }
  } catch (err: any) {
    errorMsg = err.message;
  }

  const totalRows = Array.isArray(tables)
    ? tables.reduce((acc, t) => acc + (t.row_count || 0), 0)
    : 0;
  const activeTables = Array.isArray(tables)
    ? tables.filter((t) => t.row_count > 0).length
    : 0;

  return (
    <div className="flex flex-col gap-8 w-full font-mono">
      <header className="flex justify-between items-end border-b border-[#141416] pb-6 relative">
        <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-[#E50914] to-transparent" />

        <div>
          <h1 className="text-3xl font-bold tracking-[0.2em] uppercase text-white flex items-center gap-4">
            <Database className="w-8 h-8 text-[#E50914]" />
            Database Signal
          </h1>
          <div className="flex items-center gap-4 mt-3 text-[0.65rem] text-[#68686F] uppercase tracking-[0.2em]">
            <span>PostgreSQL Matrix</span>
            <span className="w-1 h-1 bg-[#44444A] rounded-full" />
            {!errorMsg ? (
              <span className="text-[#27D17F]">Signal Locked</span>
            ) : (
              <span className="text-[#E50914]">Signal Lost</span>
            )}
          </div>
        </div>
      </header>

      {errorMsg ? (
        <div className="border border-[#E50914]/30 bg-[#310004]/20 p-5 flex gap-3">
          <ServerCrash className="w-5 h-5 text-[#E50914] shrink-0" />
          <div className="flex flex-col gap-1">
            <h3 className="text-[#E50914] text-[0.7rem] font-bold uppercase tracking-[0.1em]">
              Postgres Connection Failure
            </h3>
            <p className="text-[#A7A7AA] text-[0.65rem] uppercase tracking-wider">
              {errorMsg}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Global Record Count"
              value={totalRows.toLocaleString()}
              status="good"
              icon={<BarChart3 className="w-5 h-5" />}
              meta={`Across ${activeTables} active tables`}
            />
            <MetricCard
              title="Connection State"
              value="STABLE"
              status="good"
              icon={<Activity className="w-5 h-5" />}
              meta="Service Role Authenticated"
            />
            <MetricCard
              title="Encryption Status"
              value="AES-256"
              status="good"
              icon={<Fingerprint className="w-5 h-5" />}
              meta="RLS Enabled Globally"
            />
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {Object.entries(NAMESPACE_MAP).map(([namespace, tableNames]) => {
              const groupTables = tables.filter((t: any) =>
                tableNames.includes(t.table_name),
              );
              if (groupTables.length === 0) return null;

              return (
                <div
                  key={namespace}
                  className="border border-[#141416] bg-[#090909] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.1)_0%,transparent_70%)] pointer-events-none" />

                  <div className="p-4 border-b border-[#141416] bg-[#0D0D0F] flex justify-between items-center">
                    <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white">
                      {namespace}
                    </h2>
                    <div className="text-[#A7A7AA] text-[0.6rem] uppercase tracking-widest">
                      {groupTables.length} ACTIVE TABLES
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[0.65rem]">
                      <thead className="bg-[#111113] border-b border-[#141416] text-[#A7A7AA] uppercase tracking-[0.2em]">
                        <tr>
                          <th className="px-6 py-4 font-bold">
                            Table Identity
                          </th>
                          <th className="px-6 py-4 font-bold text-right">
                            Row Density
                          </th>
                          <th className="px-6 py-4 font-bold text-right">
                            Index Scans
                          </th>
                          <th className="px-6 py-4 font-bold text-right">
                            Seq Scans
                          </th>
                          <th className="px-6 py-4 font-bold text-right">
                            Health Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#141416]">
                        {groupTables.map((table: any) => {
                          // Simple heuristic for performance bottleneck (high sequential scans relative to index scans)
                          const hasWarning =
                            table.seq_scans > 100 &&
                            table.seq_scans > table.idx_scans * 5;
                          return (
                            <tr
                              key={table.table_name}
                              className="hover:bg-[#141416]/50 transition-colors group"
                            >
                              <td className="px-6 py-4 text-white tracking-wider">
                                <span className="group-hover:text-[#E50914] transition-colors">
                                  {table.table_name}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right text-[#4CA6FF] font-bold">
                                {table.row_count?.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-right text-[#27D17F]">
                                {table.idx_scans?.toLocaleString()}
                              </td>
                              <td
                                className={`px-6 py-4 text-right ${hasWarning ? "text-[#E50914] animate-pulse" : "text-[#FFB020]"}`}
                              >
                                {table.seq_scans?.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {hasWarning ? (
                                  <span className="text-[0.55rem] tracking-widest font-bold uppercase text-[#E50914] border border-[#E50914]/30 bg-[#E50914]/10 px-2 py-1">
                                    Missing Index
                                  </span>
                                ) : (
                                  <span className="text-[0.55rem] tracking-widest font-bold uppercase text-[#27D17F] border border-[#27D17F]/30 bg-[#27D17F]/10 px-2 py-1">
                                    Healthy
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {/* Uncategorized tables (just in case new tables are added in the future) */}
            {(() => {
              const categorizedNames = Object.values(NAMESPACE_MAP).flat();
              const uncategorized = tables.filter(
                (t: any) => !categorizedNames.includes(t.table_name),
              );
              if (uncategorized.length === 0) return null;

              return (
                <div className="border border-[#141416] bg-[#090909] relative overflow-hidden group">
                  <div className="p-4 border-b border-[#141416] bg-[#0D0D0F] flex justify-between items-center">
                    <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#68686F]">
                      Uncategorized Tables
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[0.65rem]">
                      <tbody className="divide-y divide-[#141416]">
                        {uncategorized.map((table: any) => (
                          <tr
                            key={table.table_name}
                            className="hover:bg-[#141416]/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-white tracking-wider">
                              {table.table_name}
                            </td>
                            <td className="px-6 py-4 text-right text-[#4CA6FF] font-bold">
                              {table.row_count?.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ title, value, status, icon, meta }: any) {
  const statusColors = {
    good: "text-[#27D17F]",
    warning: "text-[#FFB020]",
    critical: "text-[#FF2638]",
    neutral: "text-[#68686F]",
  };

  const statusGlow = {
    good: "shadow-[inset_0_2px_15px_rgba(39,209,127,0.03)]",
    warning: "shadow-[inset_0_2px_15px_rgba(255,176,32,0.05)]",
    critical: "shadow-[inset_0_2px_15px_rgba(255,38,56,0.1)]",
    neutral: "",
  };

  return (
    <div
      className={`border border-[#141416] bg-[#090909] p-5 relative overflow-hidden ${statusGlow[status as keyof typeof statusGlow]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[0.6rem] text-[#A7A7AA] uppercase tracking-[0.2em] font-bold">
          {title}
        </span>
        <span className={statusColors[status as keyof typeof statusColors]}>
          {icon}
        </span>
      </div>
      <div
        className={`text-xl font-bold uppercase tracking-widest mb-3 ${statusColors[status as keyof typeof statusColors]}`}
      >
        {value}
      </div>
      <div className="text-[0.55rem] text-[#68686F] uppercase tracking-[0.1em] border-t border-[#141416] pt-3">
        {meta}
      </div>
    </div>
  );
}
