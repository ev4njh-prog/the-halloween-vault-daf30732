import { getRows, type RowGroup } from "@/data/catalog";
import { Row } from "@/components/vault/Row";
import { useFavorites } from "@/hooks/use-vault";
import { PageHeader } from "@/components/vault/AppShell";

/**
 * Shared rails page used by every seasonal section.
 * Rows are materialised on demand and each `Row` mounts its cards only once
 * it scrolls into view, so a section costs almost nothing until it is seen.
 */
export function RowsPage({
  group,
  eyebrow,
  title,
  blurb,
}: {
  group: RowGroup;
  eyebrow: string;
  title: string;
  blurb: string;
}) {
  const favorites = useFavorites();
  const rows = getRows(group);

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} blurb={blurb} />
      {rows.length === 0 ? (
        <p className="gutter mx-auto max-w-[1400px] pb-24 text-sm text-moonlight/55">
          Nothing indexed for this section yet.
        </p>
      ) : (
        <div className="space-y-12 pb-20">
          {rows.map((row) => (
            <Row
              key={row.id}
              row={row}
              favorites={favorites.ids}
              onToggleFavorite={favorites.toggle}
            />
          ))}
        </div>
      )}
    </>
  );
}
