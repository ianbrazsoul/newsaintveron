# PRD — NEW SAINT VÉRON (Website Institucional Premium)

## Problema original
Website institucional dark-premium para a NEW SAINT VÉRON (Digital Experience & AI), como produto
de software de produção: design system tokenizado, SEO técnico completo, acessibilidade WCAG,
segurança by design e captura de leads real. Idioma pt-BR. Regra "sem invenções": cases,
depoimentos e números de resultados ficam FORA da v1 (estrutura existe no código, desativada).
Stack: React + FastAPI + MongoDB + SendGrid. Nível de execução alvo: Awwwards (motion premium,
hero cinético com masked reveal, parallax sutil, marquee editorial, framer-motion + lenis).

## Arquitetura
- Frontend React (Router, Tailwind, Framer Motion, Lenis, react-fast-marquee, shadcn/ui, sonner).
- Backend FastAPI: `/api/leads` (POST + GET admin-gated), `/api/health`. Rate limit em memória,
  honeypot, sanitização, CORS por env, logs sem PII. Modelos Mongo via BaseDocument/PyObjectId.
- MongoDB coleção `leads`. E-mail via SendGrid (fallback gracioso quando sem chave).

## Personas
- Empresas/decisores buscando serviços premium de experiência digital e IA.
- Owner (NEW SAINT VÉRON) recebendo e triando leads.

## Requisitos core (estáticos)
- Páginas: Home (Hero → Posicionamento → Problemas → Serviços → Diferenciais → Metodologia →
  Tecnologia & IA → FAQ → CTA), Serviços, Digital Experience, Artificial Intelligence, Contato,
  Política de Privacidade, Política de Cookies, Termos de Uso, 404 custom.
- Formulário de contato: validação client+server, honeypot, rate limit, estados loading/sucesso/erro,
  salva no Mongo + notifica por e-mail (SendGrid).
- CTA WhatsApp (wa.me + mensagem pré-preenchida, número por env).
- Banner de consentimento LGPD; GA4 só após consentimento e configurável por env.
- SEO técnico: titles/meta únicos, canonical, OG, Twitter, JSON-LD, sitemap, robots, URLs semânticas.
- Design tokenizado, acessibilidade, prefers-reduced-motion.

## Implementado (2026-06 / build inicial)
- [x] Design system tokenizado (cores, fontes fluidas, grain, seleção dourada).
- [x] Componentes base: Button (4 variantes/6 estados), Section, Card, Reveal, MaskedHeading,
      Marquee, PageHero, WhatsAppButton (float), CookieBanner (LGPD), Header sticky + menu mobile, Footer.
- [x] Todas as 9 páginas + conteúdo pt-BR derivado do posicionamento.
- [x] Hero cinético (masked line reveal + parallax) + marquee editorial.
- [x] Backend de leads: POST (validação, honeypot, rate limit, sanitização), GET admin-gated, health.
      Verificado por curl: 200+persistência, honeypot drop, 422 inválido, 403/200 admin.
- [x] SendGrid integrado com fallback gracioso (desligado sem chave).
- [x] SEO técnico (useSeo por página, JSON-LD, sitemap.xml, robots.txt), 404 custom.
- [x] Seções cases/depoimentos/resultados desativadas por FEATURE_FLAGS (regra "sem invenções").
- [x] Segurança: endpoint de leads protegido por ADMIN_API_TOKEN; segredos em env.

## Painel de Leads (adicionado)
- [x] Auth JWT (Bearer): `POST /api/auth/login`, `GET /api/auth/me`; bcrypt + brute-force 5/15min.
- [x] Admin único semeado por env (`ADMIN_EMAIL`/`ADMIN_PASSWORD`), idempotente no startup.
- [x] CRUD de triagem: `GET /api/leads` (+filtro), `GET /api/leads/stats`, `PATCH /api/leads/{id}`
      (status novo/em_contato/qualificado/descartado + nota), `DELETE /api/leads/{id}`.
- [x] Frontend `/admin/login` + `/admin` (dashboard com stats, filtros, detalhe, mudança de status,
      nota interna, exclusão). Verificado ponta a ponta pelo navegador (login → stats → leads → PATCH → filtro, todos 200).
- Nota: o token gate anterior (ADMIN_API_TOKEN) foi substituído por JWT.

## Backlog priorizado
### P0 (antes do launch — dependências externas do cliente)
- Configurar SendGrid (API key + sender verificado) para ativar e-mail de leads. **Hoje: DESLIGADO.**
- Definir número real de WhatsApp em `REACT_APP_WHATSAPP_NUMBER`. **Hoje: placeholder.**
### P1
- Criar propriedade GA4 e preencher `REACT_APP_GA4_ID` (analytics após consentimento).
- Domínio oficial + DNS + Search Console + sitemap submit; atualizar URLs absolutas.
- Substituir logo tipográfico/imagens por assets oficiais do Brand System V3.0.
### P2
- Ativar cases/depoimentos/resultados com dados reais (FEATURE_FLAGS).
- Painel admin para visualizar leads (hoje via GET protegido por token).

## Próximas tarefas
1. Coletar do cliente: SENDGRID_API_KEY + SENDER_EMAIL verificado, número de WhatsApp.
2. Ativar e-mail e validar entrega de notificação de lead ponta a ponta.
3. GA4 + domínio + Search Console quando o domínio existir.
