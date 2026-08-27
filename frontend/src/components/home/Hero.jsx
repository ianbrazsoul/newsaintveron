import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { HERO } from "@/data/content";
import { MaskedHeading } from "@/components/common/MaskedHeading";
import { Button } from "@/components/common/Button";

const HERO_IMG =
  "https://images.unsplash.com/photo-1707338252277-3f66895b0532?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000";

export const Hero = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "24%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-obsidian"
    >
      {/* Parallax treated image */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <img
          src={HERO_IMG}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-50"
          fetchPriority="high"
        />
      </motion.div>
      {/* Cinematic clip / spotlight overlays (solid, no muddy gradients on top of image only) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/30" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.10),transparent_55%)]" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 md:px-10 md:pb-24"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-overline inline-flex items-center gap-3 font-sans font-medium text-champagne">
            <span className="h-px w-10 bg-champagne/60" aria-hidden="true" />
            {HERO.overline}
          </span>
        </motion.div>

        <MaskedHeading
          as="h1"
          lines={HERO.lines}
          className="mt-8 font-serif text-hero text-ivory"
          lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:text-champagne"
        />

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="max-w-xl font-sans text-base leading-relaxed text-ivory-muted md:col-span-7 md:text-lg"
          >
            {HERO.subline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            className="flex flex-col gap-4 sm:flex-row md:col-span-5 md:justify-end"
          >
            <Button variant="primary" size="lg" to={HERO.ctaPrimary.to} icon={ArrowRight} data-testid="hero-cta-primary">
              {HERO.ctaPrimary.label}
            </Button>
            <Button variant="outline" size="lg" to={HERO.ctaSecondary.to} data-testid="hero-cta-secondary">
              {HERO.ctaSecondary.label}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {!reduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-ivory-muted"
          >
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};
