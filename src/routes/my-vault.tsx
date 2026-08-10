import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { TitleCard } from "@/components/vault/Row";
import { PageHeader } from "@/components/vault/AppShell";
import { catalogById } from "@/data/catalog";
import { useFavorites, useHydrated } from "@/hooks/use-vault";

export const Route = createFileRoute("/my-vault")({
  head: () => ({
    meta: [
      { title: "My Vault — Saved Halloween Titles" },
      {
        name: "description",
        content:
          "Everything you have saved this season, stored on your device and ready for the next October night.",
      },
      { property: "og:title", content: "My Vault — The Halloween Vault" },
      { property: "og:description", content: "Your saved titles for the season." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyVaultPage,
});

function MyVaultPage() {
  const favorites = useFavorites();
  const hydrated = useHydrated();

  // Saved IDs are resolved through the index, so a stale ID never renders.
  const saved = useMemo(
    () => favorites.ids.map(catalogById).filter((t): t is NonNullable<typeof t> => Boolean(t)),
    [favorites.ids],
  );

  return (
    <>
      <PageHeader
        eyebrow="Saved on this device"
        title="My Vault"
        blurb="Your season, kept. Favourites are stored locally — no account needed — and resolved against the live index each visit."
      />
      <div className="gutter mx-auto max-w-[1400px] pb-24">
        {!hydrated ? (
          <div className="h-64" />
        ) : saved.length === 0 ? (
          <p className="text-sm text-moonlight/60">
            Nothing saved yet. Tap the heart on any title and it will wait for you here.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] justify-items-center gap-5">
            {saved.map((item, i) => (
              <TitleCard
                key={item.id}
                item={item}
                priority={i < 6}
                isFavorite
                onToggleFavorite={favorites.toggle}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
