import { useSeo } from "@/lib/seo";
import { PageHero } from "@/components/common/PageHero";
import { Section } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";

// Shared layout for legal pages (privacy, cookies, terms).
export const LegalPage = ({ seo, overline, title, updated, sections }) => {
  useSeo(seo);
  return (
    <>
      <PageHero overline={overline} title={title} subtitle={`Última atualização: ${updated}`} />
      <Section className="bg-obsidian">
        <div className="mx-auto max-w-3xl">
          {sections.map((s, i) => (
            <Reveal key={i} delay={0.03 * i}>
              <div className="mb-12">
                {s.heading && (
                  <h2 className="mb-4 font-serif text-2xl text-ivory md:text-3xl">
                    {s.heading}
                  </h2>
                )}
                {s.paragraphs?.map((p, j) => (
                  <p
                    key={j}
                    className="mb-4 font-sans text-sm leading-relaxed text-ivory-muted md:text-base"
                  >
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-3 space-y-2">
                    {s.list.map((li, k) => (
                      <li
                        key={k}
                        className="flex gap-3 font-sans text-sm leading-relaxed text-ivory-muted md:text-base"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-champagne" />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
};
