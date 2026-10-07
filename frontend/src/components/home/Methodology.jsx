import { Section, Overline } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { METHODOLOGY } from "@/data/content";

export const Methodology = () => (
  <Section id="metodologia" className="bg-obsidian" data-testid="methodology-section">
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <Overline>{METHODOLOGY.overline}</Overline>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-7 font-serif text-display text-ivory">
              {METHODOLOGY.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 hidden lg:block">
              <div className="h-px w-16 bg-champagne" />
              <p className="mt-5 max-w-xs font-sans text-xs uppercase tracking-[0.22em] text-ivory-muted">
                Estratégia · Design · Engenharia · Evolução
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="lg:col-span-7 lg:col-start-6">
        <div className="flex flex-col">
          {METHODOLOGY.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <div className="group flex gap-6 border-b border-white/[0.07] py-9 last:border-b-0 md:gap-10">
                <span className="numeric-display w-14 shrink-0 text-3xl font-light text-champagne/50 transition-colors group-hover:text-champagne md:text-4xl">
                  {step.n}
                </span>
                <div className="pt-1">
                  <h3 className="font-serif text-2xl text-ivory md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ivory-muted">
                    {step.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </Section>
);
