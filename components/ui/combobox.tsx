// components/ui/combobox.tsx
"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HiOutlineChevronUpDown } from "react-icons/hi2";

export interface ComboboxItem {
  value: string;
  label: string;
}

export interface ComboboxProps {
  /** items to pick from */
  items: ComboboxItem[];
  /** current selected value */
  value: string;
  /** called with new value when user selects */
  onChange: (value: string) => void;
  /** placeholder shown when `value` is empty */
  placeholder?: string;
  /** fixed width (e.g. "w-[200px]") or full width "w-full" */
  widthClassName?: string;
  /** disable the combobox */
  disabled?: boolean;
  prefix?: string;
}

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Select…",
  widthClassName = "w-[200px]",
  disabled = false,
  prefix,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = React.useMemo(
    () => items.find((i) => i.value === value)?.label ?? "",
    [items, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            widthClassName,
            "justify-between rounded-xs bg-white shadow-none text-xs"
          )}
          disabled={disabled}
        >
          {prefix}
          {value ? selectedLabel : placeholder}
          <HiOutlineChevronUpDown className="opacity-50 w-2 h-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn(widthClassName, "p-0")}>
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9 text-xs"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
