import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageHero } from "@/components/common/PageHero";
import { Section } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";
import { SERVICES } from "@/data/content";

export default function Services() {
  useSeo({
    title: "Serviços",
    description:
      "Serviços premium da NEW SAINT VÉRON: Digital Experience e Inteligência Artificial, entregues como produtos de software de produção.",
    path: "/servicos",
  });

  return (
    <>
      <PageHero
        overline={SERVICES.overline}
        lines={["Duas frentes.", "Um padrão."]}
        subtitle={SERVICES.intro}
      />

      <Section className="bg-obsidian">
        <div className="flex flex-col gap-px overflow-hidden rounded-[4px] border border-white/[0.07]">
          {SERVICES.items.map((s) => (
            <Reveal key={s.slug}>
              <Link
                to={s.to}
                data-testid={`services-page-card-${s.slug}`}
                className="group grid gap-8 bg-graphite/40 p-8 transition-colors duration-500 hover:bg-graphite md:grid-cols-12 md:p-12"
              >
                <div className="md:col-span-1">
                  <span className="font-serif text-4xl italic text-champagne/70">
                    {s.index}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-3xl text-ivory transition-colors group-hover:text-champagne md:text-4xl">
                      {s.title}
                    </h2>
                    <ArrowUpRight className="h-6 w-6 text-ivory-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-champagne" />
                  </div>
                  <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-ivory-muted">
                    {s.summary}
                  </p>
                </div>
                <div className="md:col-span-6">
                  <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {s.capabilities.map((c) => (
                      <li
                        key={c}
                        className="flex items-center gap-3 border-b border-white/[0.06] pb-3 font-sans text-sm text-ivory-muted"
                      >
                        <span className="h-1 w-1 rounded-full bg-champagne" />
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

      <FaqSection />
      <FinalCta />
    </>
  );
}
