import { createFileRoute } from "@tanstack/react-router";
import { RowsPage } from "@/components/vault/RowsPage";

export const Route = createFileRoute("/autumn")({
  head: () => ({
    meta: [
      { title: "Autumn & Fall Films — The Halloween Vault" },
      {
        name: "description",
        content:
          "Cozy autumn movies, pumpkin season, harvest films and fall romance — the season beyond Halloween night.",
      },
      { property: "og:title", content: "Autumn & Fall Films — The Halloween Vault" },
      {
        property: "og:description",
        content: "Cider, sweaters and amber light: the cozy half of the season.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AutumnPage,
});

function AutumnPage() {
  return (
    <RowsPage
      group="autumn"
      eyebrow="September to November"
      title="Autumn"
      blurb="The cozy half of the season: orchards, pumpkin patches, harvest weekends and the fall romances that live in amber light."
    />
  );
}
