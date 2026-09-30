"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
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

      // Hanya internal route
      if (!href.startsWith("/") || href.startsWith("//")) return;

      // Jangan ganggu tab baru
      if (anchor.target === "_blank") return;

      const url = new URL(href, window.location.origin);

      // Kalau masih di halaman yang sama
      if (url.pathname === pathname) return;

      // Cegah double click
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
          className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >

          <motion.div
            className="absolute inset-0 bg-[#010736]"
            initial={{
              x: "100%",
            }}
            animate={{
              x: "0%",
            }}
            exit={{
              x: "-100%",
            }}
            transition={{
              duration: 0.65,
              ease: [0.76, 0, 0.24, 1],
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-3xl"
            initial={{
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.15,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            initial={{
              opacity: 0,
              scale: 0.7,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 1.08,
              y: -10,
            }}
            transition={{
              delay: 0.12,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-md ring-1 ring-white/10">
              <Image
                src="/OIP.webp"
                alt="Logo"
                width={80}
                height={80}
                priority
                className="h-auto w-auto max-h-16 max-w-16 object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}