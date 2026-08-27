import { Mail, MessageCircle, Clock } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { PageHero } from "@/components/common/PageHero";
import { Section } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { getWhatsAppUrl } from "@/components/common/WhatsAppButton";
import { CONTACT, BRAND } from "@/data/content";

export default function Contact() {
  useSeo({
    title: "Contato",
    description:
      "Fale com a NEW SAINT VÉRON. Preencha o formulário ou converse pelo WhatsApp para iniciar um projeto de experiência digital ou IA.",
    path: "/contato",
  });

  return (
    <>
      <PageHero
        overline={CONTACT.overline}
        lines={["Vamos", "conversar."]}
        subtitle={CONTACT.body}
      />

      <Section className="bg-obsidian">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex flex-col gap-8">
                <div className="flex gap-4">
                  <Mail className="h-6 w-6 shrink-0 text-champagne" />
                  <div>
                    <p className="text-overline text-ivory-muted">E-mail</p>
                    <p className="mt-2 font-sans text-lg text-ivory">{BRAND.email}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MessageCircle className="h-6 w-6 shrink-0 text-champagne" />
                  <div>
                    <p className="text-overline text-ivory-muted">WhatsApp</p>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="contact-whatsapp-link"
                      className="mt-2 inline-block font-sans text-lg text-ivory transition-colors hover:text-champagne"
                    >
                      Iniciar conversa
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="h-6 w-6 shrink-0 text-champagne" />
                  <div>
                    <p className="text-overline text-ivory-muted">Resposta</p>
                    <p className="mt-2 font-sans text-lg text-ivory">
                      Retornamos em até 2 dias úteis
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/[0.07] pt-8">
                  <p className="font-serif text-2xl italic leading-snug text-ivory-muted">
                    “{BRAND.positioning}”
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <div className="rounded-[6px] border border-white/[0.07] bg-graphite/40 p-8 md:p-10">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
