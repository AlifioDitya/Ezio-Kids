"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  staticFilter: React.ReactNode;
  stickyFilter: React.ReactNode;
};

export default function MobileCatalogHeader({
  title,
  staticFilter,
  stickyFilter,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky if sentinel is NOT intersecting and its top is above the viewport (scrolled past)
        setIsStickyVisible(
          !entry.isIntersecting && entry.boundingClientRect.top < 0
        );
      },
      { threshold: 0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Default Static Header Row */}
      <div
        ref={sentinelRef}
        className="lg:hidden flex items-center justify-between w-full mb-4"
      >
        <h1 className="text-base font-semibold">{title}</h1>
        {staticFilter}
      </div>

      {/* Sticky Header */}
      <AnimatePresence>
        {isStickyVisible && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden fixed top-[56px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-3 flex items-center justify-between"
          >
            <h1 className="text-base font-semibold text-gray-900 truncate pr-4">
              {title}
            </h1>
            <div className="shrink-0">{stickyFilter}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
