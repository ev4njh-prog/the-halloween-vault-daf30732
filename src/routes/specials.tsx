import { createFileRoute } from "@tanstack/react-router";
import { RowsPage } from "@/components/vault/RowsPage";

export const Route = createFileRoute("/specials")({
  head: () => ({
    meta: [
      { title: "TV & Specials — The Halloween Vault" },
      {
        name: "description",
        content:
          "Sitcom Halloween episodes, cartoon and animated specials, anthology nights, annual events and holiday specials.",
      },
      { property: "og:title", content: "TV & Specials — The Halloween Vault" },
      {
        property: "og:description",
        content: "Twenty-two minutes of costume chaos, plus the specials that made October.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpecialsPage,
});

function SpecialsPage() {
  return (
    <RowsPage
      group="specials"
      eyebrow="Television"
      title="TV & Specials"
      blurb="Everything broadcast rather than released: sitcom Halloween episodes, animated specials, anthology nights and the annual events that return every October."
    />
  );
}
