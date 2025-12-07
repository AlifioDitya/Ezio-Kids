"use client";

import * as React from "react";

type Props = {
  /** min thumb height in px */
  minThumb?: number;
  /** distance from viewport edges in px */
  inset?: number;
  /** extra classes for outer container */
  className?: string;
  /** allow touch dragging; default false = mouse only */
  showOnTouch?: boolean;
  /** width of the (invisible) track hit-area in px */
  trackWidth?: number;
  /** visual thumb width in px */
  thumbWidth?: number;
};

function isSafariOrIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    (/Safari/.test(ua) && !/Chrome/.test(ua)) || /iPad|iPhone|iPod/.test(ua)
  );
}

/** Floating page scrollbar thumb (overlay, no layout space) + draggable. */
export default function OverlayScrollbar({
  minThumb = 28,
  inset = 8,
  className = "",
  showOnTouch = false,
  trackWidth = 14,
  thumbWidth = 3,
}: Props) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const thumbRef = React.useRef<HTMLDivElement | null>(null);

  // drag state
  const draggingRef = React.useRef(false);
  const ptrIdRef = React.useRef<number | null>(null);
  const hideToRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);

  // cached geometry
  const metricsRef = React.useRef({
    trackTop: 0,
    trackHeight: 0,
    thumbH: 0,
    maxScroll: 1,
  });

  const [scrollable, setScrollable] = React.useState<boolean>(true);

  const clamp = (n: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, n));

  const computeMetrics = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const trackTop = rect.top;
    const trackHeight = rect.height;

    const doc = document.documentElement;
    const body = document.body;
    const scrollH = Math.max(
      body.scrollHeight,
      doc.scrollHeight,
      body.offsetHeight,
      doc.offsetHeight,
      body.clientHeight,
      doc.clientHeight
    );

    const vh = window.innerHeight;
    const maxScroll = Math.max(1, scrollH - vh);
    const thumbH = Math.max(minThumb, (vh / scrollH) * trackHeight);

    metricsRef.current = { trackTop, trackHeight, thumbH, maxScroll };
    setScrollable(maxScroll > 1);

    const thumb = thumbRef.current;
    if (thumb) thumb.style.height = `${thumbH}px`;
  }, [minThumb]);

  // map page scroll -> thumb position (transform only)
  const updateFromScroll = React.useCallback(() => {
    const run = () => {
      rafRef.current = null;
      const thumb = thumbRef.current;
      if (!thumb) return;

      const { trackHeight, thumbH, maxScroll } = metricsRef.current;
      const y = window.scrollY;
      const travel = Math.max(0, trackHeight - thumbH);
      const pos = maxScroll === 0 ? 0 : (y / maxScroll) * travel;

      thumb.style.transform = `translateY(${pos}px)`;
      // show briefly on scroll
      thumb.style.opacity = "1";
      if (hideToRef.current) window.clearTimeout(hideToRef.current);
      hideToRef.current = window.setTimeout(() => {
        if (!draggingRef.current) thumb.style.opacity = "0";
      }, 700);
    };

    if (rafRef.current == null) rafRef.current = requestAnimationFrame(run);
  }, []);

  // map pointer Y on track -> page scrollTop
  const updateScrollFromPointer = (clientY: number) => {
    const { trackTop, trackHeight, thumbH, maxScroll } = metricsRef.current;
    const travel = Math.max(0, trackHeight - thumbH);
    const pos = clamp(clientY - trackTop - thumbH / 2, 0, travel);
    const ratio = travel === 0 ? 0 : pos / travel;

    window.scrollTo({ top: ratio * maxScroll, behavior: "auto" });

    const thumb = thumbRef.current;
    if (thumb) {
      thumb.style.transform = `translateY(${pos}px)`;
      thumb.style.opacity = "1";
    }
  };

  // pointer handlers (drag)
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    // Gate *dragging* on touch, not scroll listeners
    if (!showOnTouch && e.pointerType !== "mouse") return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    ptrIdRef.current = e.pointerId;
    draggingRef.current = true;
    document.body.style.userSelect = "none";
    computeMetrics();
    updateScrollFromPointer(e.clientY);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current) return;
    if (ptrIdRef.current !== e.pointerId) return;
    e.preventDefault();
    updateScrollFromPointer(e.clientY);
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (ptrIdRef.current !== e.pointerId) return;
    draggingRef.current = false;
    ptrIdRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    document.body.style.userSelect = "";
    if (hideToRef.current) window.clearTimeout(hideToRef.current);
    hideToRef.current = window.setTimeout(() => {
      const thumb = thumbRef.current;
      if (thumb) thumb.style.opacity = "0";
    }, 400);
  };

  React.useEffect(() => {
    // Always attach listeners (even on touch devices)
    const onResize = () => {
      computeMetrics();
      updateFromScroll();
    };

    computeMetrics();
    updateFromScroll();

    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (hideToRef.current) clearTimeout(hideToRef.current);
      document.body.style.userSelect = "";
    };
  }, [computeMetrics, updateFromScroll]);

  const trackStyle: React.CSSProperties = {
    top: inset,
    bottom: inset,
    width: trackWidth,
    display: scrollable ? undefined : "none",
  };
  const thumbStyle: React.CSSProperties = {
    width: thumbWidth,
  };

  if (isSafariOrIOS()) return null;

  return (
    <div
      className={[
        "pointer-events-none fixed right-0 top-0 bottom-0 z-[60]",
        className,
      ].join(" ")}
      aria-hidden
    >
      {/* transparent rail hit-area for dragging */}
      <div
        ref={trackRef}
        className="absolute right-0 pointer-events-auto"
        style={trackStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div
          ref={thumbRef}
          className="
            absolute right-0 rounded-full
            bg-black/80 dark:bg-white/35
            transition-opacity duration-300
            will-change-transform
            opacity-0
          "
          style={thumbStyle}
        />
      </div>
    </div>
  );
}
