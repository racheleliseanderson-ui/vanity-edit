import type { ClaimCard, ClaimKind } from "./types";

/**
 * Claim-literacy layer for makeup that borrows skincare language.
 * Education only — never a safety ranking, medical clearance, or brand attack.
 * Every card answers: named? dosed? tested? and when NOT to buy.
 */

export const CLAIM_KINDS: { id: ClaimKind; label: string; line: string }[] = [
  {
    id: "spf",
    label: "SPF on makeup",
    line: "UV numbers only count when the film is continuous and reapplied. A tint is not a beach plan.",
  },
  {
    id: "treatment",
    label: "Treatment / actives",
    line: "A percentage on a box is not a prescription. If the active is not named and dosed, it is marketing perfume.",
  },
  {
    id: "hybrid",
    label: "Hybrid makeup-skincare",
    line: "Hybrid means one object does two jobs — not that either job is maximal. Trade-offs are the point.",
  },
  {
    id: "barrier",
    label: "Barrier / calm claims",
    line: "Calm language is not a diagnosis. Fragrance-free and short lists matter more than the word 'soothing'.",
  },
  {
    id: "actives",
    label: "Peptides · retinoids · acids",
    line: "If you already run a leave-on active at night, a foundation with a whisper of the same molecule is not stacking science — it is stacking irritation risk.",
  },
];

export const CLAIMS: ClaimCard[] = [
  {
    id: "spf-tinted-mineral",
    kind: "spf",
    claim: "Tinted mineral SPF 30–50 in a foundation or tint",
    named: "Active filters listed by INCI (e.g. zinc oxide, titanium dioxide) with a stated SPF number.",
    dosed: "SPF 30 is the floor for intentional UV days; SPF 50 only earns the bag if you can apply enough film.",
    tested: "Broad-spectrum testing on the finished formula, not a sister cream. Look for the number on the unit you buy.",
    whenNotToBuy:
      "When you will sheer it to a stain, blot half of it off by noon, or treat it as all-day beach cover without reapplication. Half a film is half the SPF.",
    verdict:
      "A tinted SPF earns the bag when UV is a real job that day and you will lay a continuous film. It loses the bag the moment you use it as a sheer glow with no reapply plan.",
  },
  {
    id: "spf-chemical-hybrid",
    kind: "spf",
    claim: "Chemical or hybrid SPF inside a skin tint",
    named: "Each UV filter named; 'broad spectrum' stated; PA or PPD if the market uses it.",
    dosed: "Same rule as any SPF — about a 1/4 teaspoon for the face, which most makeup applications never hit.",
    tested: "Photostability of the filter blend in that specific base, not a brochure claim.",
    whenNotToBuy:
      "Sensitive or fragrance-reactive days when the hybrid also carries scent; or when you already wear a dedicated SPF and the tint's SPF is just noise on the label.",
    verdict:
      "Hybrid SPF is honest when it replaces a second step you would skip. It is vanity when it is a second SPF on top of a full mineral fluid you already wear.",
  },
  {
    id: "spf-powder",
    kind: "spf",
    claim: "SPF setting powder / brush-on SPF",
    named: "Active filter and SPF number on the powder itself.",
    dosed: "Powders rarely deposit a continuous film. Treat stated SPF as a top-up signal, never the primary strategy.",
    tested: "In-vivo SPF on powder application method — rare; assume the number is optimistic unless the brand publishes method.",
    whenNotToBuy:
      "As your only UV product on a high-UV day. Powder SPF is a midday assist, not architecture.",
    verdict:
      "Brush-on SPF earns a pocket slot for reapplication over makeup. It loses the bag the day you cancel real SPF because the powder 'has SPF too'.",
  },
  {
    id: "treatment-niacinamide",
    kind: "treatment",
    claim: "'Treatment' foundation with niacinamide",
    named: "Niacinamide on the INCI, ideally with a stated percentage.",
    dosed: "Skincare efficacy bands often cite ~2–5%. A foundation that lists it last is not a treatment dose.",
    tested: "Clinicals on the finished makeup film are almost never published. Borrow evidence only from the brand's leave-on data if concentrations match.",
    whenNotToBuy:
      "When you already use a properly dosed niacinamide serum and the foundation is thicker than you need. You are buying film, not more science.",
    verdict:
      "Named and mid-list niacinamide is a nice-to-have. Unnamed 'brightening treatment' is a mood board. Buy the texture; do not pay prestige for a ghost percentage.",
  },
  {
    id: "treatment-hyaluronic",
    kind: "treatment",
    claim: "Hyaluronic acid / 'hydrating treatment' base",
    named: "Specific HA weights or sodium hyaluronate on the list — not just 'hydrating complex'.",
    dosed: "HA needs water and a humectant context. In a powdery or high-alcohol film it can feel tight, not plump.",
    tested: "TEWL or hydration measurements on the finished product, ideally 8+ hours — almost never shown for makeup.",
    whenNotToBuy:
      "On already-dehydrated altitude skin without a water-based prep underneath. HA in a dry film is not a drink of water.",
    verdict:
      "Hydrating bases earn the bag when the film stays flexible. They lose it when 'hyaluronic' is the only argument for a base that still cakes by 3pm.",
  },
  {
    id: "treatment-peptides",
    kind: "actives",
    claim: "Peptide or 'firming' makeup",
    named: "Specific peptide names (e.g. matrixyl-class) — not 'peptide complex' as poetry.",
    dosed: "Effective leave-on peptide products state use level; makeup almost never does. Assume sub-therapeutic.",
    tested: "Independent firming data on a makeup film does not exist in consumer reality. Treat as texture marketing.",
    whenNotToBuy:
      "When the price jump is justified only by peptide language and the shade range or wear fails your actual face.",
    verdict:
      "Peptides in foundation are a dinner-party claim. Pay for the finish and the shade map; do not tip for a molecule that never made it to a dose.",
  },
  {
    id: "treatment-retinol",
    kind: "actives",
    claim: "Retinol or bakuchiol in a tint or primer",
    named: "Retinol / retinal / bakuchiol named with a percentage.",
    dosed: "Even 0.1% retinol in a leave-on is a commitment. In makeup, contact time and occlusion change the risk profile.",
    tested: "Stability of retinol in a pigmented emulsion is hard; demand packaging that blocks light and air if you care.",
    whenNotToBuy:
      "On reactive, rosacea-prone, or pregnancy-caution days; or when you already run a night retinoid. Doubling actives is not sophistication.",
    verdict:
      "Retinoid makeup is a vice dressed as vanity. If you want the active, put it in the night routine where dose and recovery are honest.",
  },
  {
    id: "treatment-salicylic",
    kind: "actives",
    claim: "Salicylic / 'blemish treatment' concealer or powder",
    named: "Salicylic acid (BHA) with a percentage — OTC acne monographs often sit at 0.5–2%.",
    dosed: "Spot products can carry useful BHA; full-face powders with a whisper of it rarely clear anything.",
    tested: "Acne-claim products in regulated markets need monograph or drug-facts style labeling. Cosmetics wording is weaker.",
    whenNotToBuy:
      "All over dry or barrier-compromised skin; or as a substitute for a leave-on you already tolerate. Also skip if fragrance is along for the ride.",
    verdict:
      "A dosed BHA concealer can earn a spot on a breakout day. A 'clarifying' powder with no percentage is just powder with better copy.",
  },
  {
    id: "hybrid-serum-tint",
    kind: "hybrid",
    claim: "Serum skin tint — makeup + skincare in one",
    named: "Clear jobs: tone evening + stated skincare benefit (SPF, humectants) with ingredients to match.",
    dosed: "Coverage usually 15–30%. If you need 60, a hybrid will not become a foundation by wishing.",
    tested: "Wear tests and oxidation notes matter more than serum poetry. Ask how it looks at hour six, not in the tube.",
    whenNotToBuy:
      "When you need full event opacity, or when the 'serum' finish is pure silicone slip that slides off oily zones by lunch.",
    verdict:
      "Serum tints earn the bag on anti-pancake days. They lose it the moment you layer a second full base on top 'just in case'.",
  },
  {
    id: "hybrid-bb-cc",
    kind: "hybrid",
    claim: "BB / CC cream as skincare hybrid",
    named: "What the letters actually do in that brand — tone correct, SPF, moisture — named on pack.",
    dosed: "Often medium coverage with SPF 15–30. Check shade range: short ranges are the hidden cost.",
    tested: "Shade accuracy across depth bands; oxidation; transfer. Hybrid fame does not equal deep-range honesty.",
    whenNotToBuy:
      "Deep or olive undertones when the range is six fair-to-medium bottles. Hybrid is not progress if you cannot match.",
    verdict:
      "BB/CC earns the bag when the range fits your depth and the SPF is real. It loses the bag as a default for everyone — defaults erase undertones.",
  },
  {
    id: "hybrid-skincare-stick",
    kind: "hybrid",
    claim: "Multi-use balm that 'treats' as it colours",
    named: "Emollients and pigments listed; any 'treatment' actives named — not just 'nourishing oils'.",
    dosed: "Balms are emollient-first. They are not a leave-on acid or vitamin C serum with a blush on top.",
    tested: "Wear, migration into fine lines, and fragrance load — the practical tests that decide if it stays on the face.",
    whenNotToBuy:
      "Fragrance-sensitive or rosacea mid-flare days when essential oils are the 'botanical treatment'. Also skip if you need matte control.",
    verdict:
      "A good balm is architecture: one object, two jobs. A balm that sells itself as a facial is a scent story with pigment.",
  },
  {
    id: "barrier-soothing",
    kind: "barrier",
    claim: "'Soothing' / 'barrier-supporting' complexion",
    named: "Ingredients with a track record (centella, panthenol, colloidal oatmeal) actually listed — and fragrance status clear.",
    dosed: "Barrier claims without a fragrance-free statement are incomplete. Irritants undo the calm language.",
    tested: "Repeat-insult patch data is rare for makeup. Sensitive-skin marketing is not the same as dermatologist clearance.",
    whenNotToBuy:
      "During an active flare when you need bare skin or pharmacy derm-care, not a new pigmented product. Also skip if EO or heavy perfume is on the list.",
    verdict:
      "Soothing makeup earns the bag when the formula is short, fragrance-aware, and thin. It loses the bag when 'calm' is the font choice on a scented full-coverage bottle.",
  },
  {
    id: "barrier-clean",
    kind: "barrier",
    claim: "'Clean' / toxin-free makeup as skin safety",
    named: "A published exclusion list you can read — not vibes. Note what is still allowed.",
    dosed: "N/A — 'clean' is not a dose. It is a filter set. Treat it as preference, never as medical risk reduction.",
    tested: "Third-party screens vary wildly. Ask what was tested; absence of a bogeyman ingredient is not proof of tolerance.",
    whenNotToBuy:
      "When 'clean' is the only reason to pay prestige prices for a short shade range or a thick film that cakes. Architecture still wins.",
    verdict:
      "Clean is a shopping filter, not a halo. The desk honours your filters; it will not pretend a label made the layers thinner.",
  },
  {
    id: "hybrid-spf-colour",
    kind: "hybrid",
    claim: "Colour product (blush, bronzer) with SPF",
    named: "SPF number and filters on that specific stick or cream.",
    dosed: "You will never apply cheek colour at sunscreen thickness. The SPF is almost always decorative.",
    tested: "If they only tested the base without pigment, the number does not transfer.",
    whenNotToBuy:
      "Anytime you would count it toward daily UV strategy. Buy the colour for the colour.",
    verdict:
      "SPF blush is a charming lie at face-application rates. Earn the bag on pigment and blend; outsource UV to a real film.",
  },
];

export const claimsByKind = (kind: ClaimKind) => CLAIMS.filter((c) => c.kind === kind);

/** Lightweight tagger: which claim cards a product note or type job should surface. */
export function claimHintsForText(...parts: string[]): ClaimCard[] {
  const hay = parts.join(" ").toLowerCase();
  const hits: ClaimCard[] = [];
  const push = (id: string) => {
    const c = CLAIMS.find((x) => x.id === id);
    if (c && !hits.includes(c)) hits.push(c);
  };
  if (/\bspf\b|sunscreen|uv |broad.spectrum|mineral spf|tinted spf/.test(hay)) {
    push("spf-tinted-mineral");
    if (/powder|brush/.test(hay)) push("spf-powder");
    if (/hybrid|chemical|avobenzone|octisalate/.test(hay)) push("spf-chemical-hybrid");
  }
  if (/niacinamide/.test(hay)) push("treatment-niacinamide");
  if (/hyaluronic|hydrat/.test(hay)) push("treatment-hyaluronic");
  if (/peptide|firming/.test(hay)) push("treatment-peptides");
  if (/retinol|retinoid|bakuchiol/.test(hay)) push("treatment-retinol");
  if (/salicylic|bha|blemish treatment|acne/.test(hay)) push("treatment-salicylic");
  if (/serum tint|skin tint|bb |cc |hybrid/.test(hay)) push("hybrid-serum-tint");
  if (/\bbb\b|\bcc\b/.test(hay)) push("hybrid-bb-cc");
  if (/balm|multi-use|multi use/.test(hay)) push("hybrid-skincare-stick");
  if (/sooth|barrier|calm|sensitive|centella|panthenol/.test(hay)) push("barrier-soothing");
  if (/\bclean\b|toxin|non-toxic/.test(hay)) push("barrier-clean");
  if (/blush.*spf|bronzer.*spf|spf.*blush/.test(hay)) push("hybrid-spf-colour");
  return hits.slice(0, 3);
}
