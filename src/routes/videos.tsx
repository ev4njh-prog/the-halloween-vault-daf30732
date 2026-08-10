import { createFileRoute } from "@tanstack/react-router";
import { VideoDiscovery } from "@/components/vault/VideoDiscovery";
import { PageHeader } from "@/components/vault/AppShell";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Seasonal Videos — The Halloween Vault" },
      {
        name: "description",
        content:
          "A separate domain from the film library: Halloween vlogs, decor and costume builds, recipes, ambience and creator shorts.",
      },
      { property: "og:title", content: "Seasonal Videos — The Halloween Vault" },
      {
        property: "og:description",
        content: "Vlogs, decor builds, recipes and ambience — kept apart from the film library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Beyond the library"
        title="Videos"
        blurb="Short-form seasonal content — vlogs, decor and costume builds, recipes, ambience and creator shorts. Deliberately separate from the film and TV catalog, and empty until a real video provider is connected."
      />
      <div className="pb-20">
        <VideoDiscovery />
      </div>
    </>
  );
}
