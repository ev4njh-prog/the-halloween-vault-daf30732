import { createFileRoute } from "@tanstack/react-router";
import { GuideHost } from "@/components/vault/GuideHost";
import { CrystalBallPlaceholder } from "@/components/vault/CrystalBallPlaceholder";
import { PageHeader } from "@/components/vault/AppShell";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Vault Guides — The Halloween Vault" },
      {
        name: "description",
        content:
          "Meet your seasonal hosts: the Lantern Keeper and the Crystal Ball Oracle guide you through the Vault each night.",
      },
      { property: "og:title", content: "Vault Guides — The Halloween Vault" },
      {
        property: "og:description",
        content: "The Lantern Keeper and the Crystal Ball Oracle host your season.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your hosts"
        title="Guides"
        blurb="Every visit is hosted. The Lantern Keeper walks you through the season; the Crystal Ball Oracle scries for something you have not seen. Guides are presentation-only — recommendations always come from the verified index."
      />
      <div className="gutter mx-auto max-w-[1400px] space-y-8 pb-20">
        <GuideHost />
        <div className="grid gap-6 lg:grid-cols-2">
          <GuideHost preferred="lantern-keeper" />
          <CrystalBallPlaceholder />
        </div>
      </div>
    </>
  );
}
