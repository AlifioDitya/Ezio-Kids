// components/ui/combobox.tsx
"use client";

import { Check, ChevronsUpDown } from "lucide-react";
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
}

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Select…",
  widthClassName = "w-[200px]",
  disabled = false,
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
            "justify-between rounded-xs bg-white shadow-none cursor-pointer text-xs xl:text-base"
          )}
          disabled={disabled}
        >
          {value ? selectedLabel : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn(widthClassName, "p-0")}>
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
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
