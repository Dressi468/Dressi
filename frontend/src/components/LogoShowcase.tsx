import { motion } from "framer-motion";

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
const CARD_WIDTH = 230;
const CARD_GAP = 40; 

export default function LogoShowcase() {
  const trackWidth = duplicatedLogos.length * (CARD_WIDTH + CARD_GAP);

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
          <div className="logo-marquee flex gap-10" style={{ width: `${trackWidth}px` }}>
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="flex h-24 min-w-[230px] flex-none items-center justify-center rounded-3xl bg-white px-6 py-4 text-black shadow-[0_15px_35px_rgba(0,0,0,0.35)] ring-1 ring-white/60"
                aria-hidden={index >= logos.length ? true : undefined}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  className={`${logo.imageClass ?? "max-h-20"} w-auto object-contain transition hover:opacity-100`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
