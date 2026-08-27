# NEW SAINT VÉRON — Website Institucional Premium

Website institucional dark-premium para a **NEW SAINT VÉRON** (Digital Experience & AI).
Construído como produto de software de produção: design system tokenizado, SEO técnico,
acessibilidade, segurança by design e captura de leads real.

Stack: **React + FastAPI + MongoDB + SendGrid**. Idioma: **pt-BR**.

---

## Stack & Arquitetura

- **Frontend:** React 19, React Router, Tailwind CSS, Framer Motion (reveals + hero cinético),
  Lenis (smooth scroll), react-fast-marquee, shadcn/ui, sonner (toasts).
- **Backend:** FastAPI — validação de input (Pydantic), rate limiting em memória por IP,
  honeypot anti-bot, sanitização, CORS por env var, logs sem dados sensíveis.
- **Banco:** MongoDB (coleção `leads`).
- **E-mail:** SendGrid (notificação de novo lead). Desligado com fallback gracioso enquanto
  a `SENDGRID_API_KEY` não estiver configurada — o lead continua sendo salvo no banco.

### Estrutura
```
frontend/src/
  components/
    common/    Button, Section, Card, Reveal, MaskedHeading, Marquee, PageHero,
               WhatsAppButton, CookieBanner
    layout/    Header (sticky + menu mobile), Footer, Layout (Lenis + floats)
    home/      Hero, Positioning, Problems, ServicesPreview, Differentiators,
               Methodology, Technology, FaqSection, FinalCta, DisabledSections
    services/  ServiceDetail
    contact/   ContactForm
    legal/     LegalPage
  data/content.js   Toda a copy pt-BR (single source of truth)
  lib/seo.js        Hook de SEO por página (title/meta/canonical/OG/Twitter)
  pages/            Home, Services, DigitalExperience, ArtificialIntelligence,
                    Contact, Privacy, CookiePolicy, Terms, NotFound
backend/
  server.py   API /api (leads, health) + rate limit + honeypot + admin gate
  emails.py   SendGrid (envio de notificação de lead)
```

---

## Design System (tokens)

- **Cores:** Obsidian Black `#0A0A0A` (60%), Graphite Charcoal `#1C1C1C` (30%),
  Champagne Gold `#D4AF37` (10% acento), Ivory Off-White `#F5F5F0`.
- **Tipografia:** Cormorant Garamond (display/serif) + Plus Jakarta Sans (sans), fluida via `clamp()`.
- **Direção:** editorial dark premium — espaço negativo, hierarquia, bordas discretas, radius consistente.
- **Motion:** masked line-by-line reveal no hero, parallax sutil, scroll-reveals, marquee editorial,
  micro-interações. `prefers-reduced-motion` respeitado (Lenis e animações desligados).

---

## SEO técnico
- Title + meta description únicos por página (via `useSeo`), canonical, Open Graph, Twitter Cards.
- JSON-LD (Organization + WebSite) em `public/index.html`.
- `robots.txt` e `sitemap.xml` em `public/`. URLs semânticas em pt-BR. `lang="pt-BR"`, HTML semântico.

---

## Variáveis de ambiente

### backend/.env
| Variável | Descrição |
|---|---|
| `MONGO_URL` | Conexão MongoDB (pré-configurada) |
| `DB_NAME` | Nome do banco (pré-configurado) |
| `CORS_ORIGINS` | Origens permitidas (separadas por vírgula) |
| `SENDGRID_API_KEY` | Chave da API SendGrid — **vazia por padrão** (e-mail desligado) |
| `SENDER_EMAIL` | Remetente verificado no SendGrid |
| `LEAD_NOTIFICATION_EMAIL` | Destinatário das notificações de lead |
| `ADMIN_API_TOKEN` | Token para consultar `GET /api/leads` |

### frontend/.env
| Variável | Descrição |
|---|---|
| `REACT_APP_BACKEND_URL` | URL do backend (pré-configurada) |
| `REACT_APP_WHATSAPP_NUMBER` | Número do WhatsApp (formato `55DDD9XXXXXXXX`, só dígitos) |
| `REACT_APP_GA4_ID` | ID do GA4 — **vazio por padrão** (analytics desligado) |
| `REACT_APP_SITE_URL` | URL pública do site (para canonical/sitemap) |

---

## API

- `POST /api/leads` — cria lead. Corpo: `name, email, message` (obrigatórios), `company, phone,
  interest, consent` (opcionais), `website` (honeypot — deve ficar vazio). Rate limit: 5/10min por IP.
- `GET /api/health` — status + `email_enabled`.
- `GET /api/leads` — lista leads. Exige header `X-Admin-Token: <ADMIN_API_TOKEN>`.

---

## ✅ Checklist de Lançamento

**Pendências do cliente (antes do go-live):**
- [ ] **WhatsApp:** definir `REACT_APP_WHATSAPP_NUMBER` (formato `+55 DDD 9XXXX-XXXX`, só dígitos no env).
- [ ] **SendGrid:** criar API Key (Full Access) + verificar remetente; preencher `SENDGRID_API_KEY`
      e `SENDER_EMAIL`. Autenticar o domínio (SPF/DKIM/DMARC) para boa entregabilidade.
- [ ] **Domínio:** comprar domínio oficial e apontar DNS.
- [ ] **GA4:** criar propriedade real e preencher `REACT_APP_GA4_ID` (analytics só carrega após consentimento).
- [ ] **Search Console + Google Business Profile:** cadastrar após o domínio ativo; enviar sitemap.
- [ ] **Assets oficiais (Brand System V3.0):** substituir logo tipográfico e imagens tratadas, se houver.
- [ ] **Dados reais:** ativar seções de cases/depoimentos/resultados via `FEATURE_FLAGS` em `data/content.js`
      quando houver conteúdo verdadeiro (regra "sem invenções" na v1).

**Técnico:**
- [ ] Revisar `CORS_ORIGINS` para o domínio de produção.
- [ ] Rotacionar `ADMIN_API_TOKEN`.
- [ ] Atualizar URLs absolutas (`newsaintveron.com`) em `sitemap.xml`, `robots.txt`, JSON-LD e `REACT_APP_SITE_URL`.

---

## Nota de segurança
Os princípios de segurança do documento (originalmente descritos como RLS/Supabase) foram
implementados como **equivalentes na camada de API**: validação e sanitização de entrada,
rate limiting, honeypot, CORS restrito por env, endpoint de leitura de leads protegido por token,
e segredos exclusivamente em variáveis de ambiente. **Não usa Supabase.**
