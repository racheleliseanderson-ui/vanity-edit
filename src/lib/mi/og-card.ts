/** SVG share card — 1200×630 — used by /api/og. */

export function ogSvg(opts: { risk?: number | undefined; pathway?: string | undefined }) {
  const risk = Number.isFinite(opts.risk) ? Math.round(opts.risk as number) : null;
  const pathway = (opts.pathway ?? "The Edit").slice(0, 42);
  const score = risk !== null ? String(risk) : "—";
  const tone = risk === null ? "#c4a574" : risk < 25 ? "#b7c4a4" : risk < 45 ? "#c4a574" : risk < 65 ? "#c9896a" : "#9a3a3a";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">
  <rect width="1200" height="630" fill="#1c1412"/>
  <rect x="48" y="48" width="1104" height="534" fill="none" stroke="#c4a574" stroke-opacity="0.35" stroke-width="1"/>
  <text x="80" y="120" fill="#c4a574" font-family="Georgia, 'Times New Roman', serif" font-size="18" letter-spacing="6">VANITY OR VICE</text>
  <text x="80" y="168" fill="#f3eadc" font-family="Georgia, 'Times New Roman', serif" font-size="28" letter-spacing="4">MAKEUP INTELLIGENCE</text>
  <text x="80" y="300" fill="#f3eadc" font-family="Georgia, 'Times New Roman', serif" font-size="64">Pancake risk</text>
  <text x="80" y="410" fill="${tone}" font-family="Georgia, 'Times New Roman', serif" font-size="160">${score}</text>
  <text x="80" y="500" fill="#c4a574" font-family="Georgia, 'Times New Roman', serif" font-size="36" font-style="italic">${escapeXml(pathway)}</text>
  <text x="80" y="548" fill="#8a8076" font-family="Georgia, 'Times New Roman', serif" font-size="20">The Edit · architecture over cake</text>
</svg>`;
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}
