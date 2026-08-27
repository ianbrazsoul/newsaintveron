import { ArrowRight } from "lucide-react";
import { Section } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/common/Button";
import { FINAL_CTA } from "@/data/content";

export const FinalCta = () => (
  <Section id="cta" className="bg-graphite/30" data-testid="final-cta-section">
    <Reveal>
      <div className="relative overflow-hidden rounded-[6px] border border-white/[0.08] bg-obsidian px-8 py-20 md:px-16 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.10),transparent_50%)]" />
        <div className="relative max-w-2xl">
          <span className="text-overline inline-flex items-center gap-3 font-sans font-medium text-champagne">
            <span className="h-px w-8 bg-champagne/60" aria-hidden="true" />
            {FINAL_CTA.overline}
          </span>
          <h2 className="mt-7 font-serif text-display text-ivory">{FINAL_CTA.title}</h2>
          <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-ivory-muted">
            {FINAL_CTA.body}
          </p>
          <div className="mt-10">
            <Button
              variant="primary"
              size="lg"
              to={FINAL_CTA.ctaPrimary.to}
              icon={ArrowRight}
              data-testid="final-cta-btn"
            >
              {FINAL_CTA.ctaPrimary.label}
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  </Section>
);
