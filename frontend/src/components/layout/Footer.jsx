import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { FOOTER, BRAND } from "@/data/content";
import { getWhatsAppUrl } from "@/components/common/WhatsAppButton";

export const Footer = () => (
  <footer
    data-testid="site-footer"
    className="relative border-t border-white/[0.07] bg-obsidian px-6 pt-24 md:px-10"
  >
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-14 pb-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-overline text-champagne">{BRAND.tagline}</p>
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ivory-muted">
            {FOOTER.blurb}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/contato"
              data-testid="footer-contact-link"
              className="group inline-flex items-center gap-2 font-sans text-sm text-ivory transition-colors hover:text-champagne"
            >
              {BRAND.email}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-whatsapp-link"
            className="mt-3 inline-flex items-center gap-2 font-sans text-sm text-ivory-muted transition-colors hover:text-champagne"
          >
            WhatsApp
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {FOOTER.columns.map((col) => (
          <div key={col.title} className="md:col-span-3 md:col-start-auto">
            <p className="text-overline text-ivory-muted">{col.title}</p>
            <ul className="mt-6 space-y-3">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    data-testid={`footer-link-${l.to.slice(1) || "home"}`}
                    className="font-sans text-sm text-ivory-muted transition-colors hover:text-ivory"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Massive brand typography */}
      <div className="select-none overflow-hidden border-t border-white/[0.07] pt-10">
        <p className="font-serif text-[clamp(2.5rem,14vw,13rem)] leading-none tracking-tighter text-ivory/[0.06]">
          SAINT VÉRON
        </p>
      </div>

      <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-xs text-ivory-muted">
          © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
        </p>
        <p className="font-sans text-xs text-ivory-muted">
          Feito com rigor editorial · pt-BR
        </p>
      </div>
    </div>
  </footer>
);
