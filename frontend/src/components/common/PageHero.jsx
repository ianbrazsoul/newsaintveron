import { motion } from "framer-motion";
import { MaskedHeading } from "@/components/common/MaskedHeading";

// Interior page hero — consistent editorial header for sub-pages.
export const PageHero = ({ overline, title, lines, subtitle, index }) => (
  <section
    data-testid="page-hero"
    className="relative overflow-hidden border-b border-white/[0.07] bg-obsidian px-6 pb-16 pt-40 md:px-10 md:pb-24 md:pt-52"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(212,175,55,0.08),transparent_45%)]" />
    <div className="relative mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        {index && (
          <span className="font-serif text-lg italic text-champagne/70">{index}</span>
        )}
        <span className="text-overline font-sans font-medium text-champagne">
          {overline}
        </span>
      </motion.div>

      <MaskedHeading
        as="h1"
        lines={lines || [title]}
        className="mt-8 max-w-4xl font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.98] tracking-tight text-ivory"
      />

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-ivory-muted md:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  </section>
);
