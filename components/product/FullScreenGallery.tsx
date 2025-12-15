"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  PiCaretLeft,
  PiCaretRight,
  PiMagnifyingGlassMinus,
  PiMagnifyingGlassPlus,
  PiX,
} from "react-icons/pi";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";

type Props = {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  alt: string;
};

export default function FullScreenGallery({
  images,
  initialIndex = 0,
  onClose,
  alt,
}: Props) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [mounted, setMounted] = React.useState(false);
  const [isZoomMode, setIsZoomMode] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const [cursorMode, setCursorMode] = React.useState<"in" | "out">("in");
  const cursorTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Ref to store zoom instances for each slide
  const transformRefs = React.useRef<Map<number, ReactZoomPanPinchContentRef>>(
    new Map()
  );

  // Client-side mount check
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomMode) {
          exitZoomMode();
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft" && !isZoomMode) {
        handlePrev();
      } else if (e.key === "ArrowRight" && !isZoomMode) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, isZoomMode, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    resetZoom();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    resetZoom();
  };

  const resetZoom = () => {
    setIsZoomMode(false);
    setCursorMode("in");
    transformRefs.current.forEach((ref) => {
      ref.resetTransform(0);
    });
  };

  const handleZoomIn = () => {
    const ref = transformRefs.current.get(currentIndex);
    if (ref) {
      if (!isZoomMode) {
        setIsZoomMode(true);
        ref.zoomIn(0.5, 300);
        return;
      }

      const { scale } = ref.instance.transformState;
      if (scale < 2) {
        ref.zoomIn(0.5, 300);
      }
    }
  };

  const handleZoomOut = () => {
    const ref = transformRefs.current.get(currentIndex);
    if (ref) {
      ref.zoomOut(0.5, 300);
    }
  };

  const exitZoomMode = () => {
    setIsZoomMode(false);
    setCursorMode("in");
    const ref = transformRefs.current.get(currentIndex);
    if (ref) {
      ref.resetTransform(300);
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY };
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const deltaX = Math.abs(clientX - dragStartRef.current.x);
    const deltaY = Math.abs(clientY - dragStartRef.current.y);

    if (deltaX > 5 || deltaY > 5) {
      setIsDragging(true);
    }
  };

  const handleImageClick = () => {
    if (isDragging) return;

    const ref = transformRefs.current.get(currentIndex);
    if (!ref) return;

    const { scale } = ref.instance.transformState;

    if (scale < 1.4) {
      ref.zoomIn(1.5 - scale, 300);
    } else if (scale < 1.9) {
      ref.zoomIn(2 - scale, 300);
    } else {
      ref.resetTransform(300);
    }
    dragStartRef.current = null;
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-neutral-200 to-white flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[10001] w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-neutral-100 transition-colors"
        aria-label="Close"
      >
        <PiX className="w-4 h-4 text-black" />
      </button>

      {/* Default Mode */}
      {!isZoomMode && (
        <>
          <button
            onClick={() => {
              setIsZoomMode(true);
              handleZoomIn();
            }}
            className="fixed bottom-7 left-7 md:bottom-[1.625rem] md:left-[1.625rem] z-[10001] w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-neutral-100 transition-all duration-300"
            aria-label="Enter Zoom Mode"
          >
            <PiMagnifyingGlassPlus className="w-5 h-5 text-black" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="fixed left-5 top-1/2 -translate-y-1/2 z-[10001] w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-neutral-100 transition-colors"
                aria-label="Previous"
              >
                <PiCaretLeft className="w-4 h-4 text-black" />
              </button>
              <button
                onClick={handleNext}
                className="fixed right-5 top-1/2 -translate-y-1/2 z-[10001] w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-neutral-100 transition-colors"
                aria-label="Next"
              >
                <PiCaretRight className="w-4 h-4 text-black" />
              </button>
            </>
          )}
        </>
      )}

      {/* Zoom Mode - Animated Controls */}
      <AnimatePresence>
        {isZoomMode && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-5 left-5 z-[10001] flex flex-col items-center p-2 rounded-full bg-neutral-400/50 backdrop-blur-md gap-2 origin-bottom"
          >
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.2, ease: "easeOut" }}
              onClick={handleZoomOut}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-neutral-100 transition-colors shadow-sm"
              aria-label="Zoom Out"
            >
              <PiMagnifyingGlassMinus className="w-5 h-5 text-black" />
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2, ease: "easeOut" }}
              onClick={handleZoomIn}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-neutral-100 transition-colors shadow-sm"
              aria-label="Zoom In"
            >
              <PiMagnifyingGlassPlus className="w-5 h-5 text-black" />
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
              onClick={exitZoomMode}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-neutral-100 transition-colors shadow-sm mt-1"
              aria-label="Exit Zoom Mode"
            >
              <PiX className="w-5 h-5 text-black" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Counter */}
      <div className="fixed bottom-8 lg:bottom-6 left-1/2 -translate-x-1/2 z-[10001] px-4 py-2 bg-neutral-100 rounded-full">
        <span className="text-sm font-medium text-black">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Carousel */}
      <div className="absolute inset-0 z-[10000] w-full h-full overflow-hidden">
        <div
          className="flex w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              className="min-w-full h-full flex items-center justify-center"
            >
              <TransformWrapper
                ref={(ref) => {
                  if (ref) transformRefs.current.set(index, ref);
                }}
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit={true}
                centerZoomedOut={true}
                limitToBounds={true}
                smooth={true}
                wheel={{ disabled: false }}
                pinch={{ disabled: false }}
                doubleClick={{ disabled: true }}
                onTransformed={(ref) => {
                  if (cursorTimeoutRef.current) {
                    clearTimeout(cursorTimeoutRef.current);
                  }

                  cursorTimeoutRef.current = setTimeout(() => {
                    const isMaxZoom = ref.state.scale >= 1.95;
                    setCursorMode(isMaxZoom ? "out" : "in");

                    if (ref.state.scale <= 1.01 && isZoomMode) {
                      setIsZoomMode(false);
                    }
                  }, 50);
                }}
              >
                <TransformComponent
                  wrapperClass="!w-screen !h-screen"
                  contentClass="!w-screen !h-screen flex items-center justify-center"
                >
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      cursorMode === "out"
                        ? "cursor-custom-zoom-out"
                        : "cursor-custom-zoom-in"
                    }`}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleMouseMove}
                    onClick={handleImageClick}
                  >
                    <Image
                      src={src}
                      alt={`${alt} - ${index + 1}`}
                      width={1920}
                      height={1080}
                      className="h-screen w-auto object-contain select-none"
                      priority={index === initialIndex}
                      draggable={false}
                    />
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
