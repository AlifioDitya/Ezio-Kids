// components/layouts/nav/SideMenu.tsx
"use client";

import { NavItem } from "@/app/constant";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"; // add this import
import * as React from "react";
import { HiChevronRight } from "react-icons/hi2";
import { PiHeartLight } from "react-icons/pi";
import { VscChromeClose } from "react-icons/vsc";

function MenuLink({
  href,
  onNavigate,
  className,
  children,
  ...rest
}: {
  href: string;
  onNavigate: (href: string) => void;
  className?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={className}
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href);
      }}
    >
      {children}
    </a>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  data: NavItem[];
  title?: string;
};

const FALLBACK_PANEL_W = 400;
const EASE = "easeInOut";

export default function SideMenu({ open, onClose, data }: Props) {
  const router = useRouter();

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [panelW, setPanelW] = React.useState(FALLBACK_PANEL_W);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [dir, setDir] = React.useState<1 | -1>(1);
  const [viewportW, setViewportW] = React.useState<number>(
    typeof window === "undefined" ? 1024 : window.innerWidth
  );

  const [rootHover, setRootHover] = React.useState<number | null>(null);
  const [childHover, setChildHover] = React.useState<number | null>(null);

  const active = activeIndex != null ? data[activeIndex] : null;

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  React.useEffect(() => {
    const compute = () => {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      setViewportW(vw);
      const desktop = vw >= 1024;
      setIsDesktop(desktop);
      const w = desktop
        ? Math.max(360, Math.floor(vw / 3))
        : Math.min(420, Math.floor(vw * 0.92));
      setPanelW(w);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setActiveIndex(null);
      setDir(1);
      setRootHover(null);
      setChildHover(null);
    }
  }, [open]);

  const goForward = (idx: number) => {
    setDir(1);
    setActiveIndex(idx);
    setRootHover(null);
    setChildHover(null);
  };
  const goBack = () => {
    setDir(-1);
    setActiveIndex(null);
    setChildHover(null);
  };

  const handleClose = React.useCallback(() => {
    Promise.resolve()
      .then(() => {
        setDir(-1);
        setActiveIndex(null);
        setRootHover(null);
        setChildHover(null);
      })
      .then(onClose);
  }, [onClose]);

  const handleBackdrop = () => {
    if (!isDesktop && activeIndex !== null) {
      goBack();
    } else {
      handleClose();
    }
  };

  const asideWidth = isDesktop
    ? Math.min(viewportW, active ? panelW * 2 : panelW)
    : viewportW;

  const slideX = isDesktop ? -panelW : -viewportW;
  const panelSlide = isDesktop ? panelW : asideWidth;

  /* ---------- Styles ---------- */

  const itemBase =
    "group relative flex w-full items-center justify-between rounded-lg px-3 py-3 outline-none font-medium";

  const labelUnderline =
    "relative inline-block after:absolute after:left-0 after:-bottom-[2px] after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gray-900 after:transition-transform group-hover:after:scale-x-100";

  const chev = "ml-2 shrink-0 transition-all group-hover:translate-x-0.5";

  const activeParentRow = "font-medium";
  const activeParentLabel = "after:scale-x-100";

  // Helpers to compute dimming/highlight for ROOT items
  const rootAnyHighlight = activeIndex !== null || rootHover !== null;
  const rootTextClass = (idx: number) => {
    const isHighlighted = idx === activeIndex || idx === rootHover;
    return rootAnyHighlight
      ? isHighlighted
        ? "text-gray-900"
        : "text-gray-500"
      : "text-gray-900";
  };
  const rootChevronClass = (idx: number) => {
    const isHighlighted = idx === activeIndex || idx === rootHover;
    return rootAnyHighlight
      ? isHighlighted
        ? "text-gray-900"
        : "text-gray-500"
      : "text-gray-400";
  };

  // Helpers to compute dimming/highlight for CHILD items
  const childAnyHighlight = childHover !== null;
  const childTextClass = (idx: number) => {
    const isHighlighted = idx === childHover;
    return childAnyHighlight
      ? isHighlighted
        ? "text-gray-900"
        : "text-gray-500"
      : "text-gray-900";
  };
  const childChevronClass = (idx: number) => {
    const isHighlighted = idx === childHover;
    return childAnyHighlight
      ? isHighlighted
        ? "text-gray-900"
        : "text-gray-500"
      : "text-gray-400";
  };

  // Bump an epoch whenever we land on ROOT while open, to force re-mount + re-stagger
  const [rootEpoch, setRootEpoch] = React.useState(0);
  React.useEffect(() => {
    if (open && activeIndex === null) {
      setRootEpoch((e) => e + 1);
    }
  }, [open, activeIndex]);

  React.useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        handleClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open, handleClose]);

  // Navigation flow: set pending href, then close. After exit animation, push().
  const [pendingHref, setPendingHref] = React.useState<string | null>(null);
  const queueNav = React.useCallback(
    (href: string) => {
      setPendingHref(href);
      handleClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Variants for staggered entrance of root items (mobile)
  const ROOT_LIST = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const ROOT_ITEM = {
    hidden: { opacity: 0, x: -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "tween", duration: 0.3, ease: EASE },
    },
  } as Variants;

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (pendingHref) {
          const href = pendingHref;
          setPendingHref(null);
          router.push(href);
        }
      }}
    >
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={handleBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed flex flex-col left-0 top-0 z-[61] supports-[height:100dvh]:h-dvh h-svh bg-white shadow-2xl overflow-hidden"
            style={{ width: asideWidth, maxWidth: "100vw" }}
            initial={isDesktop ? { x: slideX } : { opacity: 0 }}
            animate={isDesktop ? { x: 0 } : { opacity: 1 }}
            exit={isDesktop ? { x: slideX } : { opacity: 0 }}
            transition={{
              type: "tween",
              duration: 0.24,
              ease: EASE,
            }}
          >
            {/* ====== DESKTOP GRID (two columns) ====== */}
            {isDesktop ? (
              <div
                className={`grid h-full ${
                  active ? "grid-cols-2" : "grid-cols-1"
                }`}
                style={{ width: asideWidth }}
              >
                {/* LEFT: root list + sticky header */}
                <div className="flex h-full flex-col border-r">
                  <div className="sticky top-0 z-10 hidden items-center justify-between gap-2 border-b bg-white p-3 lg:flex">
                    <button
                      onClick={handleClose}
                      className="flex items-center gap-2 rounded-md p-2 text-sm text-gray-500 hover:text-black"
                      aria-label="Close menu"
                    >
                      <VscChromeClose className="h-3.5 w-3.5" />
                      <p>Close</p>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3">
                    <nav aria-label="Root categories" className="space-y-0">
                      <motion.ul
                        key={`desktop-root-list-${rootEpoch}`}
                        className="flex flex-col gap-1"
                        variants={ROOT_LIST}
                        initial="hidden"
                        animate="visible"
                      >
                        {data.map((item, idx) => {
                          const hasChildren = !!item.children?.length;
                          const isActive = idx === activeIndex && !!active;
                          const Comp: React.ElementType = item.href
                            ? MenuLink
                            : "button";
                          const props = item.href
                            ? { href: item.href, onNavigate: queueNav }
                            : { onClick: () => setActiveIndex(idx) };

                          return (
                            <motion.li key={idx} variants={ROOT_ITEM}>
                              <Comp
                                {...props}
                                className={[
                                  itemBase,
                                  "text-lg",
                                  rootTextClass(idx),
                                  isActive ? activeParentRow : "",
                                ].join(" ")}
                                onMouseEnter={() => setRootHover(idx)}
                                onMouseLeave={() => setRootHover(null)}
                              >
                                <span
                                  className={[
                                    labelUnderline,
                                    isActive ? activeParentLabel : "",
                                  ].join(" ")}
                                >
                                  {item.label}
                                </span>
                                {hasChildren && (
                                  <HiChevronRight
                                    className={[
                                      chev,
                                      rootChevronClass(idx),
                                    ].join(" ")}
                                  />
                                )}
                              </Comp>
                            </motion.li>
                          );
                        })}
                      </motion.ul>
                    </nav>
                  </div>
                </div>

                {/* RIGHT: child panel */}
                <div className="relative flex h-full flex-col mt-16">
                  <div className="relative h-full overflow-hidden">
                    {active && (
                      <div
                        key={active.label}
                        className="absolute inset-0 bg-white"
                      >
                        <div className="h-full overflow-y-auto p-3">
                          <motion.ul
                            className="space-y-0"
                            variants={ROOT_LIST}
                            initial="hidden"
                            animate="visible"
                          >
                            {(active.children || []).map((c, idx) => {
                              const hasGrand = !!c.children?.length;
                              const Comp: React.ElementType = c.href
                                ? MenuLink
                                : "a";
                              const props = c.href
                                ? { href: c.href, onNavigate: queueNav }
                                : { role: "button" };

                              return (
                                <motion.li
                                  key={`${c.label}-${idx}`}
                                  variants={ROOT_ITEM}
                                >
                                  <Comp
                                    {...props}
                                    className={[
                                      itemBase,
                                      "text-base",
                                      childTextClass(idx), // color handled by hover state
                                    ].join(" ")}
                                    onMouseEnter={() => setChildHover(idx)}
                                    onMouseLeave={() => setChildHover(null)}
                                  >
                                    <span className={labelUnderline}>
                                      {c.label}
                                    </span>
                                    {hasGrand && (
                                      <HiChevronRight
                                        className={[
                                          chev,
                                          childChevronClass(idx),
                                        ].join(" ")}
                                      />
                                    )}
                                  </Comp>
                                </motion.li>
                              );
                            })}
                          </motion.ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* ====== MOBILE/TABLET SINGLE-PANEL ====== */
              <div className="relative h-full lg:hidden">
                <AnimatePresence initial={false} custom={dir} mode="wait">
                  {/* ROOT VIEW */}
                  {activeIndex === null && (
                    <motion.div
                      key="root"
                      className="h-full bg-white px-4 pt-4 flex flex-col justify-between"
                      initial={{ x: dir > 0 ? 0 : -panelSlide, opacity: 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: dir > 0 ? 0 : -panelSlide, opacity: 1 }}
                      transition={{ type: "tween", duration: 0.24, ease: EASE }}
                    >
                      <nav
                        aria-label="Root categories"
                        className="flex flex-col justify-between h-full"
                      >
                        {/* Top scrollable block */}
                        <motion.ul
                          key={`root-list-${rootEpoch}`}
                          className="flex flex-col gap-1"
                          variants={ROOT_LIST}
                          initial="hidden"
                          animate="visible"
                        >
                          {data.map((item, idx) => {
                            const hasChildren = !!item.children?.length;
                            const Comp: React.ElementType = item.href
                              ? MenuLink
                              : "button";
                            const props = item.href
                              ? { href: item.href, onNavigate: queueNav }
                              : { onClick: () => goForward(idx) };

                            return (
                              <motion.li key={idx} variants={ROOT_ITEM}>
                                <Comp
                                  {...props}
                                  className={[
                                    itemBase,
                                    "text-xl",
                                    "text-gray-900",
                                  ].join(" ")}
                                  onMouseEnter={() => setRootHover(idx)}
                                  onMouseLeave={() => setRootHover(null)}
                                >
                                  <span className={labelUnderline}>
                                    {item.label}
                                  </span>
                                  {hasChildren && (
                                    <HiChevronRight
                                      className={[chev, "text-gray-400"].join(
                                        " "
                                      )}
                                    />
                                  )}
                                </Comp>
                              </motion.li>
                            );
                          })}
                        </motion.ul>

                        {/* Bottom pinned Wishlist */}
                        <motion.div
                          className="flex flex-col gap-1 fixed bottom-24 left-4"
                          initial={{ opacity: 0, x: -24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            type: "tween",
                            duration: 0.4,
                            ease: EASE,
                            // start after the list has begun to animate
                            delay: 0.2 + data.length * 0.1,
                          }}
                        >
                          <MenuLink
                            href="/wishlist"
                            onNavigate={queueNav}
                            className={[
                              itemBase,
                              "text-lg",
                              "text-gray-900",
                              "flex items-center gap-3 justify-start",
                            ].join(" ")}
                          >
                            <PiHeartLight className="w-6 h-6 mt-px" />
                            <span className={labelUnderline}>My Wishlist</span>
                          </MenuLink>
                        </motion.div>
                      </nav>
                    </motion.div>
                  )}

                  {/* CHILD VIEW */}
                  {active && (
                    <motion.div
                      key={`child-${active.label}`}
                      className="absolute inset-0 bg-white"
                      initial={{ x: dir > 0 ? panelSlide : 0, opacity: 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: dir > 0 ? 0 : panelSlide, opacity: 1 }}
                      transition={{
                        type: "tween",
                        duration: 0.24,
                        ease: EASE,
                      }}
                    >
                      <div className="sticky top-0 z-10 flex items-center justify-between lg:border-b bg-white px-4 py-3">
                        <button
                          onClick={goBack}
                          className="flex items-center gap-3 rounded-md px-2 py-1 text-sm text-gray-700 hover:text-black"
                          aria-label="Back to root"
                        >
                          <ArrowLeft className="size-4 mt-0.5 lg:mt-0" />
                          <p className="text-lg lg:text-base font-medium">
                            {active?.label}
                          </p>
                        </button>
                      </div>

                      <div className="h-full overflow-y-auto p-4">
                        <ul className="space-y-1">
                          {(active.children || []).map((c, idx) => {
                            const hasGrand = !!c.children?.length;
                            const Comp: React.ElementType = c.href
                              ? MenuLink
                              : "a";
                            const props = c.href
                              ? { href: c.href, onNavigate: queueNav }
                              : { role: "button" };
                            return (
                              <motion.li
                                key={`${c.label}-${idx}`}
                                initial={{ opacity: 0, x: -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  type: "tween",
                                  duration: 0.4,
                                  ease: EASE,
                                  delay: idx * 0.1 + 0.2,
                                }}
                              >
                                <Comp
                                  {...props}
                                  className={[
                                    itemBase,
                                    "text-lg",
                                    "text-gray-900",
                                  ].join(" ")}
                                  onMouseEnter={() => setChildHover(idx)}
                                  onMouseLeave={() => setChildHover(null)}
                                >
                                  <span className={labelUnderline}>
                                    {c.label}
                                  </span>
                                  {hasGrand && (
                                    <HiChevronRight
                                      className={[chev, "text-gray-400"].join(
                                        " "
                                      )}
                                    />
                                  )}
                                </Comp>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
