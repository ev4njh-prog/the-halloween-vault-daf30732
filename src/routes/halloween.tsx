import { createFileRoute } from "@tanstack/react-router";
import { RowsPage } from "@/components/vault/RowsPage";

export const Route = createFileRoute("/halloween")({
  head: () => ({
    meta: [
      { title: "Halloween Movies — The Halloween Vault" },
      {
        name: "description",
        content:
          "Classic Halloween, family favourites, witch movies, haunted houses, horror and hidden gems — ranked by seasonal relevance.",
      },
      { property: "og:title", content: "Halloween Movies — The Halloween Vault" },
      {
        property: "og:description",
        content: "The October canon: classics, witches, haunted houses, horror and hidden gems.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HalloweenPage,
});

function HalloweenPage() {
  return (
    <RowsPage
      group="halloween"
      eyebrow="The main event"
      title="Halloween"
      blurb="Every corner of October 31st — the canon, the family classics, the covens, the haunted estates and the horror that waits until the porch light goes out."
    />
  );
}
