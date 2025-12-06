// components/search/SearchOpenButton.tsx
"use client";
import { cn } from "@/lib/utils";
import useSearchUi from "@/store/search-ui";
import { CiSearch } from "react-icons/ci";

interface Props {
  className?: string;
}

export default function SearchOpenButton({ className }: Props) {
  const open = useSearchUi((s) => s.openDrawer);
  return (
    <button
      aria-label="Search"
      onClick={open}
      className={cn(
        "text-2xl transition",
        className || "text-gray-600 hover:text-gray-800"
      )}
    >
      <CiSearch />
    </button>
  );
}
