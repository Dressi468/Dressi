import { motion } from "framer-motion";

import glowUpImage from "../assets/glow_up_image.png";
import uploadItemImage from "../assets/upload_item_image.png";
import digitalWardrobeImage from "../assets/digital_wardrobe_image.png";
import virtualTryOnImage from "../assets/virtual_try_on.png";
import styleSmarterImage from "../assets/style_smarter_image.png";

type Step = {
  title: string;
  description: string[];
  image: string;
};

const steps: Step[] = [
  {
    title: "Find your glow-up formula",
    description: [
      "Dressi uses AI to identify your skin tone and body shape, creating a personalized style formula made just for you.",
    ],
    image: glowUpImage,
  },
  {
    title: "Upload one item",
    description: [
      "Start with just one piece from your wardrobe: a dress, a blazer, even your favorite pair of jeans.",
      "Dressi instantly creates 5 outfit combinations around it, using your personalized Glow-Up Style Formula.",
    ],
    image: uploadItemImage,
  },
  {
    title: "Build your digital wardrobe",
    description: [
      "Track what you wear, rediscover forgotten favorites, and build a more authentic relationship with your clothes.",
    ],
    image: digitalWardrobeImage,
  },
  {
    title: "See yourself in every look",
    description: [
      "Bring your style to life with a personalized 3D avatar that mirrors your shape and tone.",
      "See how every outfit fits you before adding to your wardrobe.",
    ],
    image: virtualTryOnImage,
  },
  {
    title: "Style smarter, shop consciously",
    description: [
      "Dressi recommends what completes your wardrobe, not clutters it.",
      "Buy with intention, fall back in love with your closet, and build a style that lasts.",
    ],
    image: styleSmarterImage,
  },
];

const textVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

type HowDressiWorksProps = {
  onBetaClick?: () => void;
};

export default function HowDressiWorks({ onBetaClick }: HowDressiWorksProps) {
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-[#1a0013] via-black to-[#0c0210] py-16 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,82,168,0.4),rgba(0,0,0,0))]" />
        <div className="absolute -bottom-40 right-[-120px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,188,220,0.35),rgba(0,0,0,0))]" />
        <div className="absolute bottom-10 left-[-140px] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,120,198,0.25),rgba(0,0,0,0))]" />
      </div>

      <div className="mx-auto flex max-w-full flex-col gap-12 px-4 sm:gap-16 sm:px-8 lg:gap-20 lg:px-10">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold tracking-wide text-transparent bg-linear-to-r from-pink-300 via-purple-400 to-pink-500 bg-clip-text sm:text-5xl lg:text-7xl leading-tight">
            How <span className="font-extrabold italic text-transparent bg-linear-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text drop-shadow-sm">Dressi</span> Works
          </h2>
        </motion.div>

        {steps.map((step, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={step.title}
              className={`flex flex-col items-start justify-center gap-6 rounded-[28px] border border-white/15 bg-linear-to-br from-white/10 via-white/5 to-transparent p-6 shadow-[0_25px_60px_-40px_rgba(12,12,12,0.8),0_0_40px_-10px_rgba(255,82,168,0.15)] backdrop-blur-3xl transition-all duration-700 hover:shadow-[0_35px_80px_-40px_rgba(12,12,12,0.9),0_0_60px_-10px_rgba(255,82,168,0.25)] hover:border-white/25 hover:bg-linear-to-br hover:from-white/15 hover:via-white/8 hover:to-transparent sm:gap-8 sm:rounded-4xl sm:p-8 lg:min-h-[720px] lg:flex-row lg:items-center lg:justify-center lg:gap-12 lg:p-10 ${isEven ? "" : "lg:flex-row-reverse"}`}
            >
              <motion.div
                className="flex w-full max-w-xl flex-1 flex-col items-start text-left sm:items-center sm:text-center lg:max-w-[440px] lg:items-start lg:text-left"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
                <h3 className="mt-2 text-xl font-bold text-transparent bg-linear-to-r from-pink-200 via-white to-purple-300 bg-clip-text tracking-tight leading-tight sm:text-3xl lg:text-4xl">
                  {step.title}
                </h3>
                <div className="mt-5 w-full space-y-4 text-left text-sm text-white/85 leading-relaxed sm:mt-6 sm:space-y-5 sm:text-base font-light tracking-wide">
                  {step.description.map((paragraph) => (
                    <p key={paragraph} className="relative pl-6 border-l-2 border-pink-400/50 italic font-medium text-white/90 leading-loose">
                      <span className="absolute -left-0.5 top-0 h-full w-0.5 bg-linear-to-b from-pink-400/80 via-purple-400/60 to-pink-300/40"></span>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>

              <div
                className="flex w-full flex-1 items-center justify-center"
              >
                <div className="relative h-72 w-full max-w-2xl sm:h-[420px] md:h-[520px] lg:h-[640px] lg:max-w-[880px]">
                  <div className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] bg-linear-to-br from-white/25 via-transparent to-transparent blur-3xl" />
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-full w-full rounded-[40px] object-contain shadow-[0_70px_140px_-50px_rgba(15,23,42,0.62)]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-white/15 bg-white/5 px-5 py-8 text-center shadow-[0_25px_60px_-40px_rgba(12,12,12,0.8),0_0_40px_-10px_rgba(255,82,168,0.15)] backdrop-blur-2xl sm:gap-6 sm:px-8 sm:py-10"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-base font-semibold text-white/90 sm:text-xl">
            Because the future of fashion starts with what's already yours.
          </p>
          <button
            type="button"
            onClick={() => onBetaClick?.()}
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-pink-400 via-rose-400 to-purple-500 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_20px_45px_-25px_rgba(255,82,168,0.45)] transition duration-300 hover:shadow-[0_25px_60px_-25px_rgba(255,82,168,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-base"
          >
            Be a Beta Tester
          </button>
        </motion.div>
      </div>
    </section>
  );
}
