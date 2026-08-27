import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Section, Overline } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { SERVICES } from "@/data/content";

const DX_IMG =
  "https://images.unsplash.com/photo-1704354428728-24b8ccab5c3d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";
const AI_IMG =
  "https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";
const IMGS = { "digital-experience": DX_IMG, "artificial-intelligence": AI_IMG };

export const ServicesPreview = () => (
  <Section id="servicos" className="bg-obsidian" data-testid="services-section">
    <div className="grid gap-8 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <Reveal>
          <Overline>{SERVICES.overline}</Overline>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-7 font-serif text-display text-ivory">{SERVICES.title}</h2>
        </Reveal>
      </div>
      <Reveal delay={0.1} className="md:col-span-5">
        <p className="font-sans text-base leading-relaxed text-ivory-muted">
          {SERVICES.intro}
        </p>
      </Reveal>
    </div>

    <div className="mt-16 grid gap-6 lg:grid-cols-2">
      {SERVICES.items.map((s, i) => (
        <Reveal key={s.slug} delay={i * 0.1}>
          <Link
            to={s.to}
            data-testid={`service-card-${s.slug}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-[4px] border border-white/[0.07] bg-graphite/60 transition-all duration-500 hover:border-champagne/40"
          >
            <div className="relative h-56 overflow-hidden md:h-64">
              <img
                src={IMGS[s.slug]}
                alt={s.title}
                className="h-full w-full object-cover opacity-45 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite to-transparent" />
              <span className="absolute left-6 top-6 font-serif text-5xl italic text-champagne/80">
                {s.index}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-8 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-serif text-3xl text-ivory transition-colors group-hover:text-champagne">
                  {s.title}
                </h3>
                <ArrowUpRight className="mt-1 h-6 w-6 shrink-0 text-ivory-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-champagne" />
              </div>
              <p className="mt-4 font-sans text-sm leading-relaxed text-ivory-muted">
                {s.summary}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {s.capabilities.slice(0, 4).map((c) => (
                  <li
                    key={c}
                    className="rounded-[4px] border border-white/10 px-3 py-1.5 font-sans text-xs text-ivory-muted"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  </Section>
);
