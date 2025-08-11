// components/search/SearchOpenButton.tsx
"use client";
import { CiSearch } from "react-icons/ci";
import useSearchUi from "@/store/search-ui";

export default function SearchOpenButton() {
  const open = useSearchUi((s) => s.openDrawer);
  return (
    <button
      aria-label="Search"
      onClick={open}
      className="text-2xl text-gray-600 hover:text-gray-800 transition"
    >
      <CiSearch />
    </button>
  );
}
