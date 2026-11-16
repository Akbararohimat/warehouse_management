"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RouteTransition() {
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const navigatingRef = useRef(false);

  useEffect(() => {
    if (!targetPath) return;

    if (pathname === targetPath) {
      const timer = window.setTimeout(() => {
        setVisible(false);
        setTargetPath(null);
        navigatingRef.current = false;
      }, 300);

      return () => window.clearTimeout(timer);
    }
  }, [pathname, targetPath]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0) return;

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      if (!href) return;

      if (!href.startsWith("/") || href.startsWith("//")) return;

      if (anchor.target === "_blank") return;

      const url = new URL(href, window.location.origin);

      if (url.pathname === pathname) return;

      if (navigatingRef.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      navigatingRef.current = true;

      setTargetPath(url.pathname);
      setVisible(true);

      window.setTimeout(() => {
        router.push(url.pathname + url.search);
      }, 450);
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname, router]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[99999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <div className="relative flex h-[76px] w-[76px] items-center justify-center">
            {/* Rotating loading ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-white/20 border-t white"
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.85,
                ease: "linear",
                repeat: Infinity,
              }}
            />

            {/* Center text */}
            <span className="text-[15px] font-bold tracking-wide text-white">
              RnD
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
