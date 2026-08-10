import { createFileRoute } from "@tanstack/react-router";
import { RowsPage } from "@/components/vault/RowsPage";

export const Route = createFileRoute("/thanksgiving")({
  head: () => ({
    meta: [
      { title: "Thanksgiving Films & Episodes — The Halloween Vault" },
      {
        name: "description",
        content:
          "Thanksgiving films, family gatherings, fall cooking traditions and the loudest dinner episodes of the year.",
      },
      { property: "og:title", content: "Thanksgiving — The Halloween Vault" },
      {
        property: "og:description",
        content: "The long table at the end of fall: gatherings, feasts and Friendsgiving chaos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThanksgivingPage,
});

function ThanksgivingPage() {
  return (
    <RowsPage
      group="thanksgiving"
      eyebrow="The end of the season"
      title="Thanksgiving"
      blurb="Where fall lands: the long table, the parade, the kitchen, and the episodes where everyone comes home at once."
    />
  );
}
