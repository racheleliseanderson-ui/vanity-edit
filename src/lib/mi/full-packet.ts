import { GOALS, TYPE_MAP } from "./catalog";
import { PRODUCTS } from "./products";
import type { Edit, Profile, ScenarioResult } from "./types";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const LEVELS = ["none", "some", "a lot", "constantly"];

function profileLines(p: Profile): string[] {
  return [
    `Goals — ${p.goals.map((g) => GOALS.find((x) => x.id === g)?.label ?? g).join(", ") || "none set"}`,
    `Skin — ${p.skin}, sensitivity ${LEVELS[p.sensitivity]}${p.concerns.length ? `, noticing ${p.concerns.join(", ")}` : ""}`,
    `Lifestyle — ${p.climate} climate, outdoors ${LEVELS[p.outdoors]}, ${p.timeBudget} minutes each morning`,
    `Tolerance — maintenance ${p.maintenance}/3, desire ${p.desire}/3, coverage appetite ${p.coverage}/100, ceiling ${p.ceiling} objects`,
    `Filters — ${p.filters.join(", ") || "none"} · budget ${p.budget}`,
    `In the bag now — ${p.bag.map((b) => TYPE_MAP[b]?.label ?? b).join(", ") || "nothing logged"}`,
  ];
}

/** Complete, self-contained HTML packet: every stage of the edit, not just the kit. */
export function fullPacketHtml(edit: Edit, profile: Profile, scenarios: ScenarioResult[]): string {
  const a = edit.architecture;
  const rows = (items: { label: string; delta: number; note: string }[]) =>
    items
      .map(
        (c) =>
          `<tr><td>${esc(c.label)}</td><td class="num ${c.delta > 0 ? "warn" : "good"}">${c.delta > 0 ? "+" : ""}${c.delta}</td><td class="muted">${esc(c.note)}</td></tr>`,
      )
      .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>The Decision Packet · Makeup Intelligence</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root { --ink:#171114; --paper:#fbf7f4; --gilt:#8a6a3a; --rouge:#8c2f3c; --muted:#6b5f5c; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--paper); color:var(--ink); font:16px/1.75 Georgia,'Times New Roman',serif; }
  main { max-width:52rem; margin:0 auto; padding:3.5rem 1.5rem 5rem; }
  h1 { font-size:clamp(2.8rem,9vw,5.2rem); line-height:.94; letter-spacing:-.02em; margin:.4rem 0 .6rem; font-weight:400; }
  h2 { font-size:1.7rem; font-weight:400; margin:3rem 0 .4rem; border-top:1px solid #e2d8d2; padding-top:1.6rem; }
  h3 { font-size:1.15rem; font-weight:400; margin:1.6rem 0 .2rem; }
  .eyebrow { text-transform:uppercase; letter-spacing:.28em; font-size:.62rem; font-family:Helvetica,Arial,sans-serif; color:var(--gilt); }
  .lede { color:var(--muted); }
  .grid { display:flex; flex-wrap:wrap; gap:2.5rem; margin:1.5rem 0; }
  .stat span { display:block; }
  .stat .k { text-transform:uppercase; letter-spacing:.24em; font-size:.6rem; font-family:Helvetica,Arial,sans-serif; color:var(--muted); }
  .stat .v { font-size:2rem; }
  table { width:100%; border-collapse:collapse; margin:1rem 0 .5rem; font-size:.92rem; }
  th,td { text-align:left; padding:.55rem .6rem; border-bottom:1px solid #e8dfd9; vertical-align:top; }
  th { font-family:Helvetica,Arial,sans-serif; font-size:.6rem; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); font-weight:400; }
  .num { text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .good { color:#3f6b52; } .warn { color:var(--rouge); }
  .muted { color:var(--muted); }
  ul { padding-left:1.1rem; } li { margin:.25rem 0; }
  .scroll { overflow-x:auto; }
  .decision { border:1px solid var(--gilt); border-top:4px solid var(--gilt); padding:1.6rem 1.5rem; margin:2rem 0 0; background:#fdfaf7; }
  .decision h2 { border:0; margin:0 0 .6rem; padding:0; font-size:1.9rem; }
  .calls { display:grid; gap:1rem; margin:1.2rem 0 0; }
  .call { border-left:3px solid var(--rouge); padding-left:.9rem; }
  .call .k { text-transform:uppercase; letter-spacing:.22em; font-size:.58rem; font-family:Helvetica,Arial,sans-serif; color:var(--gilt); }
  .checklist { list-style:none; padding:0; }
  .checklist li { padding-left:1.6rem; position:relative; }
  .checklist li::before { content:"☐"; position:absolute; left:0; color:var(--gilt); }
  footer { margin-top:3.5rem; border-top:1px solid #e2d8d2; padding-top:1.2rem; font-size:.78rem; color:var(--muted); }
  @media print { body { background:#fff; } h2 { break-after:avoid; } table,article { break-inside:avoid; } }
</style></head>
<body><main>
  <p class="eyebrow">Vanity or Vice · Makeup Intelligence</p>
  <h1>The Decision Packet</h1>
  <p class="lede">${esc(a.headline)} · pancake risk ${a.risk} / 100 · skin-like ${a.skinlike} / 100 · exported ${new Date().toLocaleString()}</p>

  <div class="grid">
    <div class="stat"><span class="k">Objects</span><span class="v">${edit.kit.items.length} / ${edit.kit.ceiling}</span></div>
    <div class="stat"><span class="k">Films on skin</span><span class="v">${edit.kit.layers}</span></div>
    <div class="stat"><span class="k">Morning</span><span class="v">${edit.kit.minutes} min</span></div>
    <div class="stat"><span class="k">Kit tension</span><span class="v">${edit.kit.tension} / 100</span></div>
  </div>

  <section class="decision">
    <p class="eyebrow">The decision</p>
    <h2>${esc(a.headline)}</h2>
    <p class="lede">${esc(a.verdict)}</p>
    <div class="calls">
      <div class="call"><span class="k">Build this</span> ${esc(
        edit.pathways[0] ? `${edit.pathways[0].name} — ${edit.pathways[0].tradeoff}` : "No pathway scored.",
      )}</div>
      <div class="call"><span class="k">Buy in this order</span> ${esc(
        edit.kit.items.slice(0, 4).map((i) => i.label).join(" → ") || "Nothing yet.",
      )}</div>
      <div class="call"><span class="k">Skip for now</span> ${esc(
        edit.types
          .slice()
          .sort((x, y) => x.score - y.score)
          .slice(0, 3)
          .map((ty) => ty.label)
          .join(" · "),
      )}</div>
      <div class="call"><span class="k">The cheapest improvement</span> ${esc(
        edit.whatIf[0] ? `${edit.whatIf[0].label} (${edit.whatIf[0].move}) — risk would read ${edit.whatIf[0].risk}` : "None available.",
      )}</div>
    </div>
    <p class="eyebrow" style="margin-top:1.4rem">Before you buy anything</p>
    <ul class="checklist">
      <li>Your ceiling is ${edit.kit.ceiling} objects. This kit uses ${edit.kit.items.length}. Nothing enters without something leaving.</li>
      <li>${edit.kit.layers} films on skin is the number to defend. Coverage arrives from placement, not another layer.</li>
      <li>Test the base in daylight on the jaw and the chest, not the wrist.</li>
      <li>${edit.bag.replace} objects in your bag are replace-when-finished. Do not replace them early.</li>
    </ul>
  </section>

  <h2>Your inputs</h2>
  <ul>${profileLines(profile).map((l) => `<li>${esc(l)}</li>`).join("")}</ul>

  <h2>Architecture</h2>
  <p>${esc(a.verdict)}</p>
  <p class="muted">${esc(edit.kit.tensionNote)}</p>
  <table><thead><tr><th>Influence</th><th class="num">Risk</th><th>Why</th></tr></thead>
  <tbody>${rows(a.contributions)}</tbody></table>

  <h2>The kit</h2>
  <table><thead><tr><th>Object</th><th class="num">Film</th><th>Job and desk examples</th></tr></thead><tbody>
  ${edit.kit.items
    .map((it) => {
      const named = PRODUCTS.filter((p) => p.typeId === it.id)
        .slice(0, 3)
        .map((p) => `${p.brand} ${p.name} ($${p.price})`);
      return `<tr><td>${esc(it.label)}</td><td class="num">${it.layerWeight}</td><td>${esc(it.job)}<br><span class="muted">${esc((named.length ? named : [it.example]).join(" · "))}</span></td></tr>`;
    })
    .join("")}
  </tbody></table>
  <p class="muted">${esc(edit.kit.note)}</p>

  <h2>Scenario comparison</h2>
  <div class="scroll"><table><thead><tr><th>Measure</th>${scenarios.map((s) => `<th>${esc(s.label)}</th>`).join("")}</tr></thead><tbody>
    <tr><td>Move</td>${scenarios.map((s) => `<td class="muted">${esc(s.move)}</td>`).join("")}</tr>
    <tr><td>Pancake risk</td>${scenarios.map((s) => `<td class="num">${s.risk}${s.id === "current" ? "" : ` (${s.delta > 0 ? "+" : ""}${s.delta})`}</td>`).join("")}</tr>
    <tr><td>Objects</td>${scenarios.map((s) => `<td class="num">${s.objects} / ${s.ceiling}</td>`).join("")}</tr>
    <tr><td>Films</td>${scenarios.map((s) => `<td class="num">${s.layers}</td>`).join("")}</tr>
    <tr><td>Minutes</td>${scenarios.map((s) => `<td class="num">${s.minutes}</td>`).join("")}</tr>
    <tr><td>Tension</td>${scenarios.map((s) => `<td class="num">${s.tension}</td>`).join("")}</tr>
    <tr><td>Leading pathway</td>${scenarios.map((s) => `<td>${esc(s.pathway)} (${s.pathwayFit})</td>`).join("")}</tr>
    <tr><td>Kit</td>${scenarios.map((s) => `<td class="muted">${esc(s.kit.map((k) => k.label).join(", "))}</td>`).join("")}</tr>
    <tr><td>Bag calls</td>${scenarios.map((s) => `<td class="muted">${s.bag.keep} keep · ${s.bag.differently} use differently · ${s.bag.replace} replace${s.bag.changed.length ? `<br>${esc(s.bag.changed.join("; "))}` : ""}</td>`).join("")}</tr>
  </tbody></table></div>

  <h2>Alternative pathways</h2>
  ${edit.pathways
    .map(
      (p) => `<article><h3>${esc(p.name)} — ${p.fit} / 100</h3>
      <p class="muted">${esc(p.promise)}</p>
      <ul>${p.because.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <p><strong>Trade-off.</strong> ${esc(p.tradeoff)}</p>
      <p class="muted">${esc(p.types.map((t) => TYPE_MAP[t]?.label ?? t).join(" · "))} · ${p.layers} films · ${p.minutes} min</p></article>`,
    )
    .join("")}

  <h2>Every product type, scored</h2>
  <table><thead><tr><th>Type</th><th>Lane</th><th class="num">Score</th><th class="num">Film</th><th>Verdict</th></tr></thead><tbody>
  ${edit.types
    .map(
      (t) =>
        `<tr><td>${esc(t.label)}</td><td class="muted">${esc(t.lane)}</td><td class="num">${t.score}</td><td class="num">${t.layerWeight}</td><td class="muted">${esc(t.tier === "core" ? "Core of the architecture" : t.tier === "consider" ? "Consider" : "Hold for now")}${t.cautions[0] ? ` — ${esc(t.cautions[0])}` : ""}</td></tr>`,
    )
    .join("")}
  </tbody></table>

  <h2>Tools</h2>
  <table><thead><tr><th>Tool</th><th>Verdict</th><th>Why</th></tr></thead><tbody>
  ${edit.tools.map((t) => `<tr><td>${esc(t.label)}</td><td class="muted">${esc(t.verdict)}</td><td class="muted">${esc(t.why)}</td></tr>`).join("")}
  </tbody></table>

  <h2>Bag edit</h2>
  ${
    edit.bag.length
      ? `<table><thead><tr><th>Object</th><th>Call</th><th>Why</th></tr></thead><tbody>${edit.bag
          .map((b) => `<tr><td>${esc(b.label)}</td><td class="muted">${esc(b.verdict)}</td><td class="muted">${esc(b.why)}</td></tr>`)
          .join("")}</tbody></table>`
      : `<p class="muted">Nothing logged in the bag.</p>`
  }

  <h2>Coaching</h2>
  ${edit.coach.map((c) => `<p><strong>${esc(c.title)}.</strong> ${esc(c.body)}</p>`).join("")}

  <h2>Single moves, costed</h2>
  <table><thead><tr><th>Move</th><th class="num">Risk</th><th>Note</th></tr></thead><tbody>
  ${edit.whatIf
    .map(
      (w) =>
        `<tr><td>${esc(w.label)} <span class="muted">(${esc(w.move)})</span></td><td class="num ${w.delta > 0 ? "warn" : "good"}">${w.risk} (${w.delta > 0 ? "+" : ""}${w.delta})</td><td class="muted">${esc(w.note)}</td></tr>`,
    )
    .join("")}
  </tbody></table>

  <footer>Education only. Product types, named formulas and prices are illustrative and change over time — never safety
  rankings, toxin scores or medical advice. Architecture over cake.</footer>
</main></body></html>`;
}

export function downloadFullPacket(edit: Edit, profile: Profile, scenarios: ScenarioResult[]) {
  const blob = new Blob([fullPacketHtml(edit, profile, scenarios)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vov-full-edit-packet-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
