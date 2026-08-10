/**
 * Suite handoff: Makeup Intelligence → VoV Desk (Cabinet / Routine).
 * Ported from makeup-intelligence v1 for Desk import compatibility.
 * Cross-origin: download JSON + open Desk import URL. Reader chooses; nothing moves silently.
 */

import type { Edit, Profile } from "./types";
import { GOALS, TYPE_MAP } from "./catalog";

export const SUITE_PACKET_SCHEMA = "vov-suite-packet-v1" as const;
export const DESK_URL = "https://vov-desk-jn9y.vercel.app";
export const DESK_IMPORT_KEY = "vov_suite_import_v1";

export type SuitePacketMakeup = {
  schema: typeof SUITE_PACKET_SCHEMA;
  source: "makeup-intelligence";
  kind: "makeup-edit";
  target: "cabinet" | "routine";
  exportedAt: string;
  summary: string;
  fitPercent: number;
  pancakeBand?: string;
  goals: string[];
  architecture: { name: string; score: number; why: string }[];
  tools: { name: string; tier: string }[];
  items: {
    name: string;
    job: string;
    expected: string;
    evidence: string;
    decision: string;
  }[];
  boundaries: string[];
};

function pancakeBand(risk: number): string {
  if (risk >= 70) return "high_pancake_risk";
  if (risk >= 45) return "moderate_pancake_risk";
  if (risk >= 25) return "managed_risk";
  return "skinlike";
}

export function buildMakeupSuitePacket(
  edit: Edit,
  profile: Profile,
  target: "cabinet" | "routine" = "cabinet",
): SuitePacketMakeup {
  const goalLabels = profile.goals
    .map((g) => GOALS.find((x) => x.id === g)?.label ?? g)
    .slice(0, 6);

  const architecture = edit.types
    .filter((t) => t.tier === "core" || t.tier === "consider")
    .slice(0, 8)
    .map((t) => ({
      name: t.label,
      score: t.score,
      why: t.reasons[0]?.slice(0, 160) || "",
    }));

  const tools = edit.tools
    .filter((t) => t.verdict === "essential" || t.verdict === "optional")
    .slice(0, 8)
    .map((t) => ({
      name: t.label,
      tier: t.verdict === "essential" ? "essential" : "optional",
    }));

  const items = edit.kit.items.slice(0, 6).map((it) => ({
    name: it.label,
    job: it.job || "Makeup / finish",
    expected: it.example || `From Makeup Edit · layer ${it.layerWeight}`,
    evidence: "Finished formula",
    decision: "keep",
  }));

  for (const t of tools.slice(0, 3)) {
    items.push({
      name: t.name,
      job: "Other",
      expected: `Tool · ${t.tier} from Makeup Edit`,
      evidence: "Consumer survey",
      decision: t.tier === "essential" ? "keep" : "compare",
    });
  }

  const fit = Math.round(
    edit.types.filter((t) => t.tier === "core").reduce((s, t) => s + t.score, 0) /
      Math.max(1, edit.types.filter((t) => t.tier === "core").length),
  );
  const band = pancakeBand(edit.architecture.risk);
  const summary = `Good-for-You edit · fit ${fit}% · ${band.replace(/_/g, " ")} · ${
    edit.kit.items
      .slice(0, 3)
      .map((a) => a.label)
      .join(", ")
  }`;

  return {
    schema: SUITE_PACKET_SCHEMA,
    source: "makeup-intelligence",
    kind: "makeup-edit",
    target,
    exportedAt: new Date().toISOString(),
    summary,
    fitPercent: fit,
    pancakeBand: band,
    goals: goalLabels,
    architecture,
    tools,
    items,
    boundaries: [
      "Educational completeness only — not diagnosis or clinical clearance",
      "Explicit handoff — nothing moves until you import on the Desk",
      "Local vault stays in your browser unless you export again",
    ],
  };
}

export function downloadSuitePacket(packet: SuitePacketMakeup) {
  const blob = new Blob([JSON.stringify(packet, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vov-makeup-packet-${packet.target}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Stage packet for Desk same-browser handoff via localStorage. */
export function stagePacketForDesk(packet: SuitePacketMakeup) {
  try {
    localStorage.setItem(DESK_IMPORT_KEY, JSON.stringify(packet));
  } catch {
    /* quota / private */
  }
}

export function deskImportUrl(target: "cabinet" | "routine" = "cabinet") {
  const path = target === "routine" ? "/routine" : "/cabinet";
  return `${DESK_URL}${path}?import=suite`;
}

export async function sendToDesk(
  edit: Edit,
  profile: Profile,
  target: "cabinet" | "routine" = "cabinet",
) {
  const packet = buildMakeupSuitePacket(edit, profile, target);
  stagePacketForDesk(packet);
  downloadSuitePacket(packet);
  try {
    await navigator.clipboard.writeText(JSON.stringify(packet));
  } catch {
    /* clipboard denied */
  }
  window.open(deskImportUrl(target), "_blank", "noopener,noreferrer");
  return packet;
}

/** Helper when only type ids are known. */
export function labelForType(id: string) {
  return TYPE_MAP[id]?.label ?? id;
}
