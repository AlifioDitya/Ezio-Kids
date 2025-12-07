"use client";

import CheckboxFilter, {
  type CheckboxItem,
} from "@/components/filters/CheckboxFilter";

export interface SleeveLengthFilterProps {
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
}

const SleeveLengths: CheckboxItem[] = [
  { value: "short", label: "Short Sleeve" },
  { value: "long", label: "Long Sleeve" },
];

export default function SleeveLengthFilter({
  selectedSlugs,
  onToggle,
}: SleeveLengthFilterProps) {
  return (
    <CheckboxFilter
      items={SleeveLengths}
      selected={selectedSlugs}
      onToggle={onToggle}
      size="sm"
      gapClassName="space-y-3"
    />
  );
}
