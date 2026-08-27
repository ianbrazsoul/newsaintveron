import { Section, Overline } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { PROBLEMS } from "@/data/content";

export const Problems = () => (
  <Section id="problemas" className="bg-graphite/30" data-testid="problems-section">
    <div className="max-w-3xl">
      <Reveal>
        <Overline>{PROBLEMS.overline}</Overline>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-7 font-serif text-display text-ivory">{PROBLEMS.title}</h2>
      </Reveal>
    </div>

    <div className="mt-16 grid gap-px overflow-hidden rounded-[4px] border border-white/[0.07] bg-white/[0.04] sm:grid-cols-2">
      {PROBLEMS.items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.06}>
          <div className="group h-full bg-obsidian p-8 transition-colors duration-500 hover:bg-graphite md:p-10">
            <span className="font-sans text-xs tracking-[0.3em] text-champagne/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 font-serif text-2xl text-ivory">{item.title}</h3>
            <p className="mt-4 font-sans text-sm leading-relaxed text-ivory-muted">
              {item.text}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);
