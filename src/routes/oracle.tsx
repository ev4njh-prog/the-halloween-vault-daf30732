import { createFileRoute } from "@tanstack/react-router";
import { Oracle } from "@/components/vault/Oracle";
import { PageHeader } from "@/components/vault/AppShell";

export const Route = createFileRoute("/oracle")({
  head: () => ({
    meta: [
      { title: "The Halloween Oracle — The Halloween Vault" },
      {
        name: "description",
        content:
          "Pick a mood and cast the spell. The Oracle draws a verified, seasonally-ranked recommendation from the Vault — never an invented title.",
      },
      { property: "og:title", content: "The Halloween Oracle" },
      {
        property: "og:description",
        content: "Choose a mood, cast the spell, get one verified pick from the Vault.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OraclePage,
});

function OraclePage() {
  return (
    <>
      <PageHeader
        eyebrow="Ask and be answered"
        title="The Halloween Oracle"
        blurb="Choose a mood and cast the spell. Every answer is validated against the index before it appears — the Oracle can only name something that actually exists."
      />
      <div className="pb-20">
        <Oracle />
      </div>
    </>
  );
}
