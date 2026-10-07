import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { Section, Overline } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/common/Button";
import { FinalCta } from "@/components/home/FinalCta";

// Reusable service detail layout driven by data.
export const ServiceDetail = ({
  index,
  overline,
  heroLines,
  subtitle,
  intro,
  capabilities,
  approach,
  sibling,
}) => (
  <>
    <PageHero index={index} overline={overline} lines={heroLines} subtitle={subtitle} />

    <Section className="bg-obsidian">
      <div className="grid gap-12 md:grid-cols-12 md:items-center">
        <Reveal className="md:col-span-6">
          <div className="relative h-[420px] overflow-hidden rounded-[4px] border border-white/[0.07] bg-graphite">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(212,175,55,0.14),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_55%)]" />
            <div className="absolute left-8 top-8 h-24 w-24 border-l border-t border-champagne/40" />
            <div className="absolute bottom-8 right-8 h-24 w-24 border-b border-r border-champagne/40" />
            <div className="absolute bottom-8 left-8">
              <span className="numeric-display block text-5xl font-light text-champagne/70">
                {index}
              </span>
              <span className="mt-2 block text-overline font-sans text-ivory-muted">
                {overline}
              </span>
            </div>
          </div>
        </Reveal>

        <div className="md:col-span-5 md:col-start-8">
          <Reveal>
            <Overline>Visão</Overline>
          </Reveal>
          {intro.map((p, i) => (
            <Reveal key={i} delay={0.05 + i * 0.05}>
              <p className="mt-6 font-sans text-base leading-relaxed text-ivory-muted">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>

    <Section className="bg-graphite/30">
      <Reveal>
        <Overline>Capacidades</Overline>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-7 max-w-2xl font-serif text-display text-ivory">
          O que entregamos.
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 0.08}>
            <div className="group border-t border-white/[0.1] pt-6">
              <span className="numeric-display text-xs tracking-[0.18em] text-champagne/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-serif text-2xl text-ivory">{c.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ivory-muted">
                {c.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section className="bg-obsidian">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <Overline>Abordagem</Overline>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-7 font-serif text-display text-ivory">Como pensamos.</h2>
          </Reveal>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <div className="group flex gap-6 border-b border-white/[0.07] py-8 last:border-b-0">
                <span className="numeric-display text-2xl font-light text-champagne/50 transition-colors group-hover:text-champagne">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-2xl text-ivory">{a.title}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ivory-muted">
                    {a.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
          {sibling && (
            <Reveal delay={0.1}>
              <div className="mt-10">
                <Button variant="outline" size="md" to={sibling.to} icon={ArrowRight} data-testid="service-sibling-btn">
                  {sibling.label}
                </Button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </Section>

    <FinalCta />
  </>
);
