// components/common/SwipeImageStage.tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
// Removed Shopify Media import
// import { Media } from "@/lib/shopify/types";
import Image from "next/image";
import * as React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { HiOutlinePause, HiOutlinePlay } from "react-icons/hi2";
import SegmentedSliderPager from "./SegmentedSliderPager";

// Minimal local definition for Media to support the code logic
type Media = {
  mediaContentType: "IMAGE" | "VIDEO" | "EXTERNAL_VIDEO";
  id: string;
  image: { url: string; altText?: string };
  sources?: { url: string }[];
  alt?: string;
  previewImage?: { url: string };
  embedUrl?: string;
};

type Props = {
  images: (Media | string)[];
  alt: string;
  className?: string;
  /** e.g. "aspect-square", "aspect-[4/5]"; default "aspect-[3/4]" */
  aspectClass?: string;
  /** staticMode:
   *  - <lg: first image only (no arrows/pager)
   *  - lg+: carousel, arrows on hover, no drag/swipe
   */
  staticMode?: boolean;
  showArrows?: boolean;
  showPager?: boolean;
  loop?: boolean;
  unoptimized?: boolean;
  /** Callback when image is clicked, receives the image index */
  onImageClick?: (index: number) => void;
};

export default function SwipeImageStage({
  images,
  alt,
  className = "",
  aspectClass = "aspect-[3/4]",
  staticMode = false,
  showArrows = true,
  showPager = true,
  loop = true,
  unoptimized,
  onImageClick,
}: Props) {
  const clean = React.useMemo(() => (images ?? []).filter(Boolean), [images]);
  const count = clean.length;

  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [index, setIndex] = React.useState(0);
  const [loaded, setLoaded] = React.useState<Record<string, boolean>>({});

  const markLoaded = (src: string) =>
    setLoaded((m) => (m[src] ? m : { ...m, [src]: true }));

  const items = React.useMemo(() => {
    const normalize = (item: Media | string) => {
      if (typeof item === "string") {
        return { type: "IMAGE", url: item, alt: alt, id: item, poster: "" };
      }
      if (item.mediaContentType === "IMAGE") {
        return {
          type: "IMAGE",
          url: item.image.url,
          alt: item.image.altText || alt,
          id: item.id,
          poster: "",
        };
      }
      if (item.mediaContentType === "VIDEO") {
        return {
          type: "VIDEO",
          url: item.sources?.[0]?.url,
          alt: item.alt || alt,
          id: item.id,
          poster: item.previewImage?.url,
        };
      }
      if (item.mediaContentType === "EXTERNAL_VIDEO") {
        return {
          type: "EXTERNAL_VIDEO",
          url: item.embedUrl,
          alt: item.alt || alt,
          id: item.id,
          poster: item.previewImage?.url,
        };
      }
      return null;
    };
    return clean
      .map(normalize)
      .filter((x): x is NonNullable<ReturnType<typeof normalize>> => !!x);
  }, [clean, alt]);

  // Track video playback state for each video
  const [videoStates, setVideoStates] = React.useState<
    Record<string, { isPlaying: boolean; userPaused: boolean }>
  >({});
  const videoRefs = React.useRef<Record<string, HTMLVideoElement | null>>({});

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap() ?? 0);
    onSelect();
    api.on("select", onSelect);
    return () => void api.off("select", onSelect);
  }, [api]);

  // Handle video autoplay/pause on slide change
  React.useEffect(() => {
    items.forEach((item, i) => {
      if (item.type !== "VIDEO") return;
      const video = videoRefs.current[item.id];
      if (!video) return;

      if (i === index) {
        // Active slide: play if not user-paused
        const state = videoStates[item.id];
        if (!state?.userPaused) {
          video.play().catch(() => {
            // Autoplay might be blocked
          });
        }
      } else {
        // Inactive slide: pause and reset userPaused so it autoplays next time
        video.pause();
        if (videoStates[item.id]?.userPaused) {
          setVideoStates((prev) => ({
            ...prev,
            [item.id]: { ...prev[item.id], userPaused: false },
          }));
        }
      }
    });
  }, [index, items, videoStates]);

  const stopAll = (e: React.SyntheticEvent | Event) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
  };

  const goTo = (i: number) => api?.scrollTo(i);
  const prev = (e?: React.SyntheticEvent) => {
    if (e) stopAll(e);
    api?.scrollPrev();
  };
  const next = (e?: React.SyntheticEvent) => {
    if (e) stopAll(e);
    api?.scrollNext();
  };

  if (count === 0) {
    return (
      <Skeleton
        className={`relative ${aspectClass} w-full overflow-hidden rounded-xs ${className} bg-neutral-300 dark:bg-neutral-700`}
      />
    );
  }

  /** ---------- STATIC MODE ---------- */
  if (staticMode) {
    const firstItem = items[0];
    if (!firstItem) return null;

    // For static mode, if video, show poster as image
    const src = firstItem.type === "IMAGE" ? firstItem.url : firstItem.poster;
    const isLoaded = !!loaded[src || ""];

    return (
      <div
        className={["group relative w-full select-none", className].join(" ")}
      >
        {/* <lg: single image only */}
        <div className="lg:hidden">
          <div className={`relative w-full overflow-hidden ${aspectClass}`}>
            {!isLoaded && (
              <Skeleton
                aria-hidden
                className="absolute inset-0 z-10 rounded-xs bg-neutral-300/90 dark:bg-neutral-700/90 animate-pulse"
              />
            )}
            {src && (
              <Image
                src={src}
                alt={alt}
                fill
                priority
                className={[
                  "object-cover transition-opacity duration-300",
                  isLoaded ? "opacity-100" : "opacity-0",
                ].join(" ")}
                unoptimized={unoptimized}
                onLoad={() => markLoaded(src)}
              />
            )}
          </div>
        </div>

        {/* lg+: non-draggable carousel with arrows on hover */}
        <div className="hidden lg:block">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-0">
              {items.map((item, i) => {
                const itemSrc = item.type === "IMAGE" ? item.url : item.poster;
                const isL = !!loaded[itemSrc || ""];
                return (
                  <CarouselItem key={i} className="basis-full pl-0">
                    <div
                      className={`relative w-full overflow-hidden ${aspectClass}`}
                    >
                      {!isL && (
                        <Skeleton
                          aria-hidden
                          className="absolute inset-0 z-10 rounded-xs bg-neutral-300/90 dark:bg-neutral-700/90 animate-pulse"
                        />
                      )}
                      {itemSrc && (
                        <Image
                          src={itemSrc}
                          alt={alt}
                          fill
                          priority={i === 0}
                          className={[
                            "object-cover transition-opacity duration-300",
                            isL ? "opacity-100" : "opacity-0",
                          ].join(" ")}
                          unoptimized={unoptimized}
                          onLoad={() => markLoaded(itemSrc)}
                        />
                      )}
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {showArrows && count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onPointerDown={stopAll}
                onMouseDown={stopAll}
                onTouchStart={stopAll}
                onClick={prev}
                className={[
                  "absolute left-2 inset-y-0 my-auto z-20 h-7 w-7 hidden lg:flex items-center justify-center",
                  "rounded-full bg-transparent",
                  "transition-opacity duration-150 lg:opacity-0 lg:group-hover:opacity-100",
                ].join(" ")}
              >
                <BsChevronLeft className="text-gray-900" size={14} />
                <BsChevronLeft
                  className="text-gray-100 -ml-[0.8rem]"
                  size={14}
                />
              </button>

              <button
                type="button"
                aria-label="Next image"
                onPointerDown={stopAll}
                onMouseDown={stopAll}
                onTouchStart={stopAll}
                onClick={next}
                className={[
                  "absolute right-2 inset-y-0 my-auto z-20 h-7 w-7 hidden lg:flex items-center justify-center",
                  "rounded-full bg-transparent",
                  "transition-opacity duration-150 lg:opacity-0 lg:group-hover:opacity-100",
                ].join(" ")}
              >
                <BsChevronRight className="text-gray-900" size={14} />
                <BsChevronRight
                  className="text-gray-100 -ml-[0.95rem]"
                  size={14}
                />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  /** ---------- NON-STATIC MODE ---------- */
  const currentItem = items[index];
  const currentSrc = currentItem
    ? currentItem.type === "IMAGE"
      ? currentItem.url
      : currentItem.poster
    : "";
  const isLoaded = !!loaded[currentSrc || ""];

  return (
    <div
      className={[
        "group relative w-full select-none",
        "touch-pan-y",
        className,
      ].join(" ")}
      aria-roledescription="carousel"
      aria-live="polite"
      aria-busy={!isLoaded}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop, containScroll: "trimSnaps" }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {items.map((item, i) => {
            const itemSrc = item.type === "IMAGE" ? item.url : item.poster;
            const slideLoaded = !!loaded[itemSrc || ""];
            return (
              <CarouselItem key={i} className="basis-full pl-px">
                <div
                  className={`relative w-full overflow-hidden ${aspectClass} ${
                    onImageClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onImageClick?.(i)}
                >
                  {item.type === "IMAGE" && (
                    <>
                      {!slideLoaded && (
                        <Skeleton
                          aria-hidden
                          className="absolute inset-0 z-10 rounded-xs bg-neutral-300/90 dark:bg-neutral-700/90 animate-pulse"
                        />
                      )}
                      {itemSrc && (
                        <Image
                          src={itemSrc}
                          alt={alt}
                          fill
                          priority={i === 0}
                          className={[
                            "object-cover transition-opacity duration-300",
                            slideLoaded ? "opacity-100" : "opacity-0",
                          ].join(" ")}
                          unoptimized={unoptimized}
                          onLoad={() => markLoaded(itemSrc)}
                        />
                      )}
                    </>
                  )}
                  {item.type === "VIDEO" && (
                    <div className="relative w-full h-full bg-black group">
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[item.id] = el;
                        }}
                        src={item.url}
                        poster={item.poster}
                        className="absolute inset-0 w-full h-full object-cover"
                        preload="metadata"
                        loop
                        muted
                        playsInline
                        disablePictureInPicture
                        controlsList="nodownload noplaybackrate"
                        onPlay={() =>
                          setVideoStates((prev) => ({
                            ...prev,
                            [item.id]: {
                              ...(prev[item.id] || {}),
                              isPlaying: true,
                            },
                          }))
                        }
                        onPause={() =>
                          setVideoStates((prev) => ({
                            ...prev,
                            [item.id]: {
                              ...(prev[item.id] || {}),
                              isPlaying: false,
                            },
                          }))
                        }
                      />
                      {!prefersReducedMotion && (
                        <div className="absolute right-3 bottom-20 z-10 text-gray-800">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const video = videoRefs.current[item.id];
                              if (!video) return;
                              if (video.paused) {
                                video.play().catch(() => {});
                                setVideoStates((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    isPlaying: true,
                                    userPaused: false,
                                  },
                                }));
                              } else {
                                video.pause();
                                setVideoStates((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    isPlaying: false,
                                    userPaused: true,
                                  },
                                }));
                              }
                            }}
                            aria-label={
                              videoStates[item.id]?.userPaused
                                ? "Play video"
                                : "Pause video"
                            }
                            className="transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            {videoStates[item.id]?.userPaused ||
                            !videoStates[item.id]?.isPlaying ? (
                              <HiOutlinePlay size={24} />
                            ) : (
                              <HiOutlinePause size={24} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {item.type === "EXTERNAL_VIDEO" && (
                    <div className="relative w-full h-full bg-black">
                      <iframe
                        src={`${item.url}?autoplay=1&loop=1&mute=1`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Arrows (md+, hover) */}
      {showArrows && count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onPointerDown={stopAll}
            onMouseDown={stopAll}
            onTouchStart={stopAll}
            onClick={prev}
            className={[
              "absolute left-2 inset-y-0 my-auto z-20 h-7 w-7 hidden md:flex items-center justify-center",
              "rounded-full bg-transparent",
              "transition-opacity duration-150 md:opacity-0 md:group-hover:opacity-100",
            ].join(" ")}
          >
            <BsChevronLeft className="text-gray-900" size={14} />
            <BsChevronLeft className="text-gray-100 -ml-[0.8rem]" size={14} />
          </button>

          <button
            type="button"
            aria-label="Next image"
            onPointerDown={stopAll}
            onMouseDown={stopAll}
            onTouchStart={stopAll}
            onClick={next}
            className={[
              "absolute right-2 inset-y-0 my-auto z-20 h-7 w-7 hidden md:flex items-center justify-center",
              "rounded-full bg-transparent",
              "transition-opacity duration-150 md:opacity-0 md:group-hover:opacity-100",
            ].join(" ")}
          >
            <BsChevronRight className="text-gray-900" size={14} />
            <BsChevronRight className="text-gray-100 -ml-[0.95rem]" size={14} />
          </button>
        </>
      )}

      {/* Mobile pager */}
      {count > 1 && showPager && (
        <div className="absolute inset-x-0 bottom-0 z-10 px-0 lg:hidden">
          <SegmentedSliderPager
            count={count}
            index={index}
            onSelect={(i) => goTo(i)}
            ariaLabel="Slide pager"
            trackClassName="bg-gray-100"
            activeClassName="bg-slate-800/70"
            height={1}
          />
        </div>
      )}
    </div>
  );
}
