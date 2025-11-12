import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

import aiSalonLogo from "../assets/ai_salon_logo.webp";
import dailyTelegraphLogo from "../assets/daily_telegraph.webp";
import genieFriendLogo from "../assets/genie_friend_logo.webp";
import launchPadLogo from "../assets/LaunchPad_W_back.webp";
import parramattaLogo from "../assets/parramatta_logo.webp";
import pitchClubLogo from "../assets/pitch_club_logo.webp";
import societyLogo from "../assets/society_log.webp";
import styleCircleLogo from "../assets/style_circle_logo.webp";
import torrentUniLogo from "../assets/torrent_uni_logo.webp";
import unswLogo from "../assets/unsw_logo.webp";
import utsLogo from "../assets/uts_logo.webp";
import wsuLogo from "../assets/wsu_logo.webp";

type LogoItem = {
  src: string;
  alt: string;
  imageClass?: string;
};

const logos: LogoItem[] = [
  { src: aiSalonLogo, alt: "AI Salon" },
  { src: dailyTelegraphLogo, alt: "Daily Telegraph" },
  { src: genieFriendLogo, alt: "Genie Friends" },
  { src: launchPadLogo, alt: "WSU LaunchPad" },
  { src: parramattaLogo, alt: "City of Parramatta" },
  { src: pitchClubLogo, alt: "Pitch Club", imageClass: "max-h-24" },
  { src: societyLogo, alt: "Not So Secret Society" },
  { src: styleCircleLogo, alt: "The Style Circle" },
  { src: torrentUniLogo, alt: "Torrens University Australia" },
  { src: unswLogo, alt: "UNSW Founders" },
  { src: utsLogo, alt: "UTS Startups" },
  { src: wsuLogo, alt: "Western Sydney University" },
];

const duplicatedLogos = [...logos, ...logos];
const SCROLL_DURATION_SECONDS = 28;
const MIN_CARD_WIDTH = 230;
const CARD_GAP = 40;
const MIN_LOOP_WIDTH = logos.length * (MIN_CARD_WIDTH + CARD_GAP);

export default function LogoShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [loopWidth, setLoopWidth] = useState<number>(0);
  const [motionAllowed, setMotionAllowed] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const progressRef = useRef(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const preloaded = logos.map((logo) => {
      const img = new Image();
      img.src = logo.src;
      return img;
    });

    return () => {
      preloaded.forEach((img) => {
        img.onload = null;
      });
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const node = trackRef.current;
    if (!node) return;

    const calculateLoopDistance = () => {
      const singleLoopWidth = node.scrollWidth / 2;
      if (singleLoopWidth > 0) {
        const styles = window.getComputedStyle(node);
        const gapValue =
          parseFloat(styles.columnGap || styles.gap || "0") || 0;
        const cycleWidth = singleLoopWidth + gapValue / 2;
        setLoopWidth(Math.max(cycleWidth, MIN_LOOP_WIDTH));
      }
    };

    calculateLoopDistance();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(calculateLoopDistance);
      resizeObserver.observe(node);
      return () => resizeObserver.disconnect();
    }

    window.addEventListener("resize", calculateLoopDistance);
    return () => window.removeEventListener("resize", calculateLoopDistance);
  }, []);

  useEffect(() => {
    progressRef.current = 0;
    x.set(0);
  }, [loopWidth, x]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setMotionAllowed(!mediaQuery.matches);
      if (mediaQuery.matches) {
        x.set(0);
      }
    };

    handleChange();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [x]);

  useAnimationFrame((_, delta) => {
    if (!motionAllowed || loopWidth === 0 || isHovered) return;

    const distancePerSecond = loopWidth / SCROLL_DURATION_SECONDS;
    const deltaDistance = distancePerSecond * (delta / 1000);

    const nextProgress = (progressRef.current + deltaDistance) % loopWidth;
    progressRef.current = nextProgress;
    x.set(-nextProgress);
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative isolate border-y border-white/5 bg-linear-to-b from-black via-black/95 to-black py-10 sm:py-12"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 bg-linear-to-b from-pink-500/10 to-transparent blur-3xl" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 text-center">
          <div className="flex w-full items-center gap-4">
            <span className="hidden flex-1 rounded-full bg-linear-to-b from-transparent via-white/40 to-white/60 lg:block h-px" />
            <h2 className="text-xl font-semibold uppercase tracking-[0.35em] text-transparent sm:text-2xl bg-linear-to-b from-pink-400 via-purple-300 to-blue-300 bg-clip-text">
              As Seen On
            </h2>
            <span className="hidden flex-1 rounded-full bg-linear-to-b from-transparent via-white/40 to-white/60 lg:block h-px" />
          </div>
        </div>
        <div className="relative overflow-hidden">
          <motion.div
            ref={trackRef}
            className="logo-marquee flex gap-10"
            style={{ x }}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="flex h-24 min-w-[230px] flex-none items-center justify-center rounded-3xl bg-white px-6 py-4 text-black shadow-[0_15px_35px_rgba(0,0,0,0.35)] ring-1 ring-white/60"
                aria-hidden={index >= logos.length ? true : undefined}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="eager"
                  decoding="async"
                  className={`${logo.imageClass ?? "max-h-20"} w-auto object-contain transition hover:opacity-100`}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
