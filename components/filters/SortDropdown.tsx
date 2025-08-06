// components/ui/SortDropdown.tsx
"use client";

import { Combobox, ComboboxItem } from "@/components/ui/combobox";

export interface SortDropdownProps {
  /** A unique key for this dropdown (used in labelling) */
  id: string;
  /** The user‐visible label (also used as placeholder) */
  label: string;
  /** The list of options */
  items: ComboboxItem[];
  /** Currently selected value */
  value: string;
  /** Called when the user picks a new value */
  onChange: (value: string) => void;
  /** Override the placeholder text (defaults to `label`) */
  placeholder?: string;
  /** Tailwind width utility (e.g. "w-full" or "w-[200px]") */
  widthClassName?: string;
  /** Disable the dropdown */
  disabled?: boolean;
}

export default function SortDropdown({
  id,
  label,
  items,
  value,
  onChange,
  placeholder,
  widthClassName = "w-full",
  disabled = false,
}: SortDropdownProps) {
  const placeholderText = placeholder ?? label;

  return (
    <div>
      {/* Visually hidden label for accessibility & SEO */}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <Combobox
        items={items}
        value={value}
        onChange={onChange}
        placeholder={placeholderText}
        widthClassName={widthClassName}
        disabled={disabled}
      />
    </div>
  );
}
