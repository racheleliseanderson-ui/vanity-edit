/** Canonical share metadata for makeup.vanityvice.blog. No network at runtime. */

export const SITE_ORIGIN = "https://makeup.vanityvice.blog";
export const PUBLICATION = "https://vanityvice.blog/";
export const EDITORIAL = "https://vanityvice.blog/editorial-standards/";
export const SPA_DESK = "https://spa.vanityvice.blog/";
export const SKINCARE_DESK = "https://skincare.vanityvice.blog/";

export type SharePage = {
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const SHARE: Record<string, SharePage> = {
  "/": {
    path: "/",
    title: "Makeup Intelligence · Vanity or Vice",
    description:
      "Pancake makeup starts with the wrong question. Score product types against skin, goals and lifestyle — then decide what earns the bag.",
    image: "/og/home.png",
    imageAlt: "Makeup Intelligence — architecture over cake. Vanity or Vice.",
  },
  "/edit": {
    path: "/edit",
    title: "The Edit · Makeup Intelligence",
    description:
      "The bag is already making decisions. Adjust skin, goals and tolerance and watch pancake risk rescore — before buying another base.",
    image: "/og/edit.png",
    imageAlt: "The Edit — live pancake-risk scoring. Vanity or Vice.",
  },
  "/products": {
    path: "/products",
    title: "Product Search · Makeup Intelligence",
    description:
      "Searching by brand is how cake happens. Find formulas by lane, layer weight, price and preference — tied to the type they belong to.",
    image: "/og/products.png",
    imageAlt: "Product Search — formulas by lane and layer weight. Vanity or Vice.",
  },
  "/desk": {
    path: "/desk",
    title: "The desk · Makeup Intelligence",
    description:
      "A house on a desk is not a ranking. Read why each brand sits here, at which price tier, and what earns or loses the bag.",
    image: "/og/desk.png",
    imageAlt: "The desk — houses by lane and price tier. Vanity or Vice.",
  },
  "/insights": {
    path: "/insights",
    title: "Why makeup cakes · Makeup Intelligence",
    description:
      "Why makeup cakes, with the maths visible. Transparent score weights and claim literacy for SPF, treatment and hybrid makeup.",
    image: "/og/insights.png",
    imageAlt: "Why makeup cakes — the maths visible. Vanity or Vice.",
  },
};

export function shareHead(path: keyof typeof SHARE | string) {
  const page = SHARE[path] ?? SHARE["/"]!;
  const url = `${SITE_ORIGIN}${page.path === "/" ? "/" : page.path}`;
  const image = `${SITE_ORIGIN}${page.image}`;
  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Vanity or Vice" },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: page.imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.title },
      { name: "twitter:description", content: page.description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
