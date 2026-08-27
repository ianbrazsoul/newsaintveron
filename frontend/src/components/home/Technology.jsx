import { Section, Overline } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { StackMarquee } from "@/components/common/Marquee";
import { TECHNOLOGY } from "@/data/content";

export const Technology = () => (
  <Section id="tecnologia" className="bg-graphite/30" data-testid="technology-section">
    <div className="grid gap-12 md:grid-cols-12">
      <div className="md:col-span-6">
        <Reveal>
          <Overline>{TECHNOLOGY.overline}</Overline>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-7 font-serif text-display text-ivory">{TECHNOLOGY.title}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-lg font-sans text-base leading-relaxed text-ivory-muted">
            {TECHNOLOGY.body}
          </p>
        </Reveal>
      </div>

      <div className="md:col-span-5 md:col-start-8">
        <div className="flex flex-col gap-8">
          {TECHNOLOGY.pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="rounded-[4px] border border-white/[0.07] bg-obsidian p-7 transition-colors duration-500 hover:border-champagne/40">
                <h3 className="font-serif text-xl text-champagne">{p.title}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ivory-muted">
                  {p.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-16">
      <StackMarquee />
    </div>
  </Section>
);
