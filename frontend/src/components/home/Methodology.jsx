import { Section, Overline } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { METHODOLOGY } from "@/data/content";

const METHOD_IMG =
  "https://images.unsplash.com/photo-1622396481322-3b83d186701b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";

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
            <div className="mt-10 hidden overflow-hidden rounded-[4px] border border-white/[0.07] lg:block">
              <img
                src={METHOD_IMG}
                alt="Arquitetura minimalista em tons escuros"
                className="h-64 w-full object-cover opacity-40 grayscale"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="lg:col-span-7 lg:col-start-6">
        <div className="flex flex-col">
          {METHODOLOGY.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <div className="group flex gap-6 border-b border-white/[0.07] py-9 last:border-b-0 md:gap-10">
                <span className="w-14 shrink-0 font-serif text-4xl italic text-champagne/50 transition-colors group-hover:text-champagne md:text-5xl">
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
