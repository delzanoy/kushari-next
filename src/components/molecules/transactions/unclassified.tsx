import type { FilterDropdownOption } from "@/components/molecules/ComplexFilter";

/** Filter value for items with no classification. Not a real classification name. */
export const UNCLASSIFIED = "__unclassified__";

/**
 * The "Unclassified" filter option, pinned above the classification names and
 * set apart by a divider, a dashed icon matching the rows' empty "Select" chip,
 * and a count. Returns null when every item is classified, so it only shows up
 * when there's something to find.
 */
export function unclassifiedOption(count: number): FilterDropdownOption | null {
  if (count === 0) return null;
  return {
    id: UNCLASSIFIED,
    value: UNCLASSIFIED,
    searchText: "unclassified",
    displayProps: {
      fullName: "Unclassified",
      icon: (
        <span
          aria-hidden
          className="block size-3.5 rounded-full border border-dashed border-[var(--color-icon-muted)]"
        />
      ),
    },
    trailingText: String(count),
    separatorAfter: true,
  };
}
