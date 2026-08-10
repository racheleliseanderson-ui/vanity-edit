import { TYPE_MAP } from "./catalog";
import { PRODUCTS } from "./products";
import type { Edit, Profile, ScenarioResult } from "./types";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface ComparePacketMove {
  id: string;
  label: string;
  move: string;
  note: string;
}

const sign = (n: number) => (n > 0 ? `+${n}` : `${n}`);

/** Self-contained HTML dossier for the scenario comparison. */
export function comparePacketHtml(
  edit: Edit,
  profile: Profile,
  scenarios: ScenarioResult[],
  moves: ComparePacketMove[],
  setName?: string,
): string {
  const base = scenarios[0];
  const rest = scenarios.slice(1);
  const cols = (fn: (s: ScenarioResult) => string) => scenarios.map((s) => fn(s)).join("");
  const delta = (s: ScenarioResult, v: number, b: number) =>
    s.id === base?.id ? `${v}` : `${v}${v === b ? "" : ` <span class="d">(${sign(v - b)})</span>`}`;
  const changedCls = (s: ScenarioResult, v: number, b: number) => (s.id !== base?.id && v !== b ? " chg" : "");

  const row = (label: string, pick: (s: ScenarioResult) => number) => {
    const b = base ? pick(base) : 0;
    return `<tr><td>${esc(label)}</td>${cols(
      (s) => `<td class="num${changedCls(s, pick(s), b)}">${delta(s, pick(s), b)}</td>`,
    )}</tr>`;
  };

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>The Compare Packet · Makeup Intelligence</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root { --ink:#171114; --paper:#fbf7f4; --gilt:#8a6a3a; --rouge:#8c2f3c; --muted:#6b5f5c; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--paper); color:var(--ink); font:16px/1.75 Georgia,'Times New Roman',serif; }
  main { max-width:56rem; margin:0 auto; padding:3.5rem 1.5rem 5rem; }
  h1 { font-size:2.8rem; line-height:1.05; margin:.4rem 0 .6rem; font-weight:400; }
  h2 { font-size:1.7rem; font-weight:400; margin:3rem 0 .4rem; border-top:1px solid #e2d8d2; padding-top:1.6rem; }
  h3 { font-size:1.1rem; font-weight:400; margin:1.4rem 0 .2rem; }
  .eyebrow { text-transform:uppercase; letter-spacing:.28em; font-size:.62rem; font-family:Helvetica,Arial,sans-serif; color:var(--gilt); }
  .lede { color:var(--muted); }
  table { width:100%; border-collapse:collapse; margin:1rem 0 .5rem; font-size:.9rem; }
  th,td { text-align:left; padding:.55rem .6rem; border-bottom:1px solid #e8dfd9; vertical-align:top; }
  th { font-family:Helvetica,Arial,sans-serif; font-size:.6rem; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); font-weight:400; }
  .num { text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .chg { background:#f4ece2; }
  .d { color:var(--gilt); font-size:.8em; }
  .muted { color:var(--muted); }
  .drop { color:var(--rouge); text-decoration:line-through; }
  .add { color:var(--gilt); }
  ul { padding-left:1.1rem; } li { margin:.25rem 0; }
  .scroll { overflow-x:auto; }
  footer { margin-top:3.5rem; border-top:1px solid #e2d8d2; padding-top:1.2rem; font-size:.78rem; color:var(--muted); }
  @media print { body { background:#fff; } h2 { break-after:avoid; } table,article { break-inside:avoid; } }
</style></head>
<body><main>
  <p class="eyebrow">Vanity or Vice · Makeup Intelligence</p>
  <h1>The Compare Packet</h1>
  <p class="lede">${esc(edit.architecture.headline)} · pancake risk ${edit.architecture.risk} / 100 · skin-like ${
    edit.architecture.skinlike
  } / 100 · ${rest.length} scenario${rest.length === 1 ? "" : "s"} beside the baseline${
    setName ? ` · set “${esc(setName)}”` : ""
  } · exported ${new Date().toLocaleString()}</p>

  <h2>Scenarios selected</h2>
  ${
    moves.length
      ? `<table><thead><tr><th>Scenario</th><th>What it changes</th><th>Why it is worth running</th></tr></thead><tbody>${moves
          .map((m) => `<tr><td>${esc(m.label)}</td><td class="muted">${esc(m.move)}</td><td class="muted">${esc(m.note)}</td></tr>`)
          .join("")}</tbody></table>`
      : `<p class="muted">No scenarios selected — the baseline stands alone.</p>`
  }

  <h2>Score deltas</h2>
  <div class="scroll"><table><thead><tr><th>Measure</th>${cols(
    (s) => `<th>${esc(s.label)}</th>`,
  )}</tr></thead><tbody>
    <tr><td>Move</td>${cols((s) => `<td class="muted">${esc(s.move)}</td>`)}</tr>
    ${row("Pancake risk", (s) => s.risk)}
    ${row("Skin-like", (s) => s.skinlike)}
    ${row("Films on skin", (s) => s.layers)}
    ${row("Minutes", (s) => s.minutes)}
    ${row("Objects", (s) => s.objects)}
    ${row("Ceiling", (s) => s.ceiling)}
    ${row("Kit tension", (s) => s.tension)}
    <tr><td>Leading pathway</td>${cols(
      (s) =>
        `<td class="${s.id !== base?.id && base && s.pathway !== base.pathway ? "chg" : ""}">${esc(s.pathway)} <span class="muted">(${s.pathwayFit})</span></td>`,
    )}</tr>
  </tbody></table></div>

  <h2>Flipped bag verdicts</h2>
  ${
    rest.some((s) => s.bag.changed.length)
      ? rest
          .filter((s) => s.bag.changed.length)
          .map(
            (s) =>
              `<article><h3>${esc(s.label)}</h3><ul>${s.bag.changed
                .map((c) => `<li>${esc(c)}</li>`)
                .join("")}</ul><p class="muted">${s.bag.keep} keep · ${s.bag.differently} use differently · ${s.bag.replace} replace when finished</p></article>`,
          )
          .join("")
      : `<p class="muted">No bag verdict flipped under these scenarios — your existing objects hold their calls either way.</p>`
  }

  <h2>Kit differences</h2>
  ${
    rest.length
      ? rest
          .map((s) => {
            const added = s.kit.filter((k) => !base?.kit.some((b) => b.label === k.label));
            const dropped = (base?.kit ?? []).filter((b) => !s.kit.some((k) => k.label === b.label));
            return `<article><h3>${esc(s.label)}</h3>${
              added.length || dropped.length
                ? `<ul>${added
                    .map((k) => `<li class="add">+ ${esc(k.label)} <span class="muted">· ${esc(k.lane)}</span></li>`)
                    .join("")}${dropped.map((k) => `<li class="drop">${esc(k.label)}</li>`).join("")}</ul>`
                : `<p class="muted">Same objects as the baseline — only the numbers move.</p>`
            }</article>`;
          })
          .join("")
      : `<p class="muted">Nothing to diff.</p>`
  }

  <h2>Final kit contents</h2>
  <p class="muted">Your profile as it stands: ${edit.kit.items.length} of ${edit.kit.ceiling} objects · ${
    edit.kit.layers
  } films · ${edit.kit.minutes} min · tension ${edit.kit.tension} / 100</p>
  <table><thead><tr><th>Object</th><th class="num">Film</th><th>Job and desk examples</th></tr></thead><tbody>
  ${edit.kit.items
    .map((it) => {
      const named = PRODUCTS.filter((p) => p.typeId === it.id)
        .slice(0, 3)
        .map((p) => `${p.brand} ${p.name} ($${p.price})`);
      return `<tr><td>${esc(it.label)} <span class="muted">· ${esc(TYPE_MAP[it.id]?.lane ?? "")}</span></td><td class="num">${
        it.layerWeight
      }</td><td>${esc(it.job)}<br><span class="muted">${esc((named.length ? named : [it.example]).join(" · "))}</span></td></tr>`;
    })
    .join("")}
  </tbody></table>
  <p class="muted">${esc(edit.kit.note)}</p>
  <p class="muted">Ceiling ${profile.ceiling} objects · coverage appetite ${profile.coverage} / 100 · ${
    profile.timeBudget
  } minutes each morning.</p>

  <footer>Education only. Product types, named formulas and prices are illustrative and change over time — never safety
  rankings, toxin scores or medical advice. Architecture over cake.</footer>
</main></body></html>`;
}

export function downloadComparePacket(
  edit: Edit,
  profile: Profile,
  scenarios: ScenarioResult[],
  moves: ComparePacketMove[],
  setName?: string,
) {
  const blob = new Blob([comparePacketHtml(edit, profile, scenarios, moves, setName)], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vov-compare-packet-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}