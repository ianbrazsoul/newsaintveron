import { Section, Overline } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { DIFFERENTIATORS } from "@/data/content";

export const Differentiators = () => (
  <Section id="diferenciais" className="bg-graphite/30" data-testid="differentiators-section">
    <div className="max-w-3xl">
      <Reveal>
        <Overline>{DIFFERENTIATORS.overline}</Overline>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-7 font-serif text-display text-ivory">
          {DIFFERENTIATORS.title}
        </h2>
      </Reveal>
    </div>

    <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {DIFFERENTIATORS.items.map((item, i) => (
        <Reveal key={item.title} delay={(i % 3) * 0.08}>
          <div className="group border-t border-white/[0.1] pt-6">
            <div className="mb-5 h-px w-10 bg-champagne transition-all duration-500 group-hover:w-20" />
            <h3 className="font-serif text-2xl text-ivory">{item.title}</h3>
            <p className="mt-4 font-sans text-sm leading-relaxed text-ivory-muted">
              {item.text}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);
