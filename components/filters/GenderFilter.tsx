// components/filters/GenderFilter.tsx
"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type GenderValue = "boys" | "girls" | "everyone";

export interface GenderFilterProps {
  value: GenderValue | null;
  onChange: (value: GenderValue) => void;
  className?: string;
}

const OPTIONS: { label: string; value: GenderValue }[] = [
  { label: "Boys", value: "boys" },
  { label: "Girls", value: "girls" },
  { label: "Everyone", value: "everyone" },
];

export default function GenderFilter({
  value,
  onChange,
  className,
}: GenderFilterProps) {
  return (
    <div className={className}>
      <RadioGroup
        value={value ?? undefined}
        onValueChange={(v) => onChange(v as GenderValue)}
        className="space-y-2"
      >
        {OPTIONS.map((opt) => {
          const id = `gender-${opt.value}`;
          return (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem id={id} value={opt.value} />
              <Label htmlFor={id} className="text-sm text-gray-800">
                {opt.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
