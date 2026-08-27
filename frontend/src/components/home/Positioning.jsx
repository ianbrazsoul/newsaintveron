import { Section, Overline } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { POSITIONING } from "@/data/content";

export const Positioning = () => (
  <Section id="posicionamento" className="bg-obsidian" data-testid="positioning-section">
    <div className="grid gap-12 md:grid-cols-12">
      <div className="md:col-span-5">
        <Reveal>
          <Overline>{POSITIONING.overline}</Overline>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-7 font-serif text-display text-ivory">
            {POSITIONING.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-ivory-muted">
            {POSITIONING.body}
          </p>
        </Reveal>
      </div>

      <div className="md:col-span-6 md:col-start-7">
        <div className="flex flex-col divide-y divide-white/[0.07]">
          {POSITIONING.chapters.map((c, i) => (
            <Reveal key={c.n} delay={0.1 + i * 0.08}>
              <div className="group flex gap-6 py-8 first:pt-0">
                <span className="font-serif text-2xl italic text-champagne/70 transition-colors group-hover:text-champagne">
                  {c.n}
                </span>
                <div>
                  <h3 className="font-serif text-2xl text-ivory">{c.title}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ivory-muted">
                    {c.text}
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
