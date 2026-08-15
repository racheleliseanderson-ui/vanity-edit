/** Shared editorial definitions. One name per concept. */

export const PANCAKE_DEF =
  "Pancake makeup is a thick, mask-like, visibly-makeup finish that cracks and settles into lines. The score exists so you can see that failure coming — and spend desire on architecture instead of opacity.";

export const TERMS = {
  pancakeRisk:
    "Profile pancake risk is the 0–100 chance this instrument profile builds that mask. Lower is better. It starts at a base of 30; every named weight then moves it.",
  dayBriefPancake:
    "Day-brief pancake is a different 0–100, scored from this day's hours, climate and pathway — not the profile risk in the header. Both: lower is better; they are not interchangeable.",
  architecture:
    "Architecture is how the kit is structured — placement and film order — rather than how much opacity it carries.",
  kitTension:
    "Kit tension is the 0–100 pull between what you want, how many objects you will allow, and the minutes you actually have.",
  fit: "Fit is how well a product type matches this profile. It runs from a neutral baseline of 50, then signed weights stretch it.",
  confidence:
    "Confidence is how complete and internally consistent today's brief is — not a promise the finish will hold.",
  filmCost:
    "A film is one continuous layer sitting on the skin — primer, base and powder each count as one. Film cost is the 0–3 opacity that object adds.",
} as const;

/** Canonical name for the 0–3 opacity scale. Use this everywhere. */
export const FILM_COST = "Film cost";
