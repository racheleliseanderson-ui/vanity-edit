import { createFileRoute } from "@tanstack/react-router";

import { ogSvg } from "@/lib/mi/og-card";

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const riskRaw = url.searchParams.get("risk");
        const risk = riskRaw !== null && riskRaw !== "" ? Number(riskRaw) : undefined;
        const svg = ogSvg({
          risk: Number.isFinite(risk) ? risk : undefined,
          pathway: url.searchParams.get("path") ?? undefined,
        });
        return new Response(svg, {
          headers: {
            "content-type": "image/svg+xml; charset=utf-8",
            "cache-control": "public, max-age=600",
          },
        });
      },
    },
  },
});
