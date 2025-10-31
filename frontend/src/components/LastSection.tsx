import { useState } from "react";
import { Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import EarlyAccessModal from "./EarlyAccessModal";

export default function CallToActionSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-linear-to-b from-white via-pink-50 to-white py-16 sm:py-24"
    >
      <EarlyAccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="mx-auto max-w-2xl text-center px-4">
        <h2 className="mb-4 text-3xl font-extrabold leading-tight text-black sm:text-5xl">
          <div><span className="text-2xl text-black sm:text-3xl">unforgettable</span> <span className="text-pink-500">Style</span></div>
          <div><span className="text-2xl text-black sm:text-3xl">unshakable</span> <span className="text-pink-500">Confidence</span></div>
          <div><span className="text-2xl text-black sm:text-3xl">uncompromised</span> <span className="text-pink-500">Planet</span></div>
        </h2>
        <p className="mb-8 text-base text-neutral-700 sm:text-lg">
          Be the first to <span className="text-pink-500 font-semibold">experience smarter, sustainable styling.</span> 
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-white px-7 py-3 text-base font-semibold text-black shadow-lg ring-1 ring-black/10 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200 sm:w-auto"
            onClick={() => setModalOpen(true)}
          >
            <Crown className="h-5 w-5" />
            Join the Beta
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
