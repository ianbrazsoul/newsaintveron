const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const templatePath = path.join(buildDir, "index.html");

if (!fs.existsSync(templatePath)) {
  throw new Error("Build template not found: " + templatePath);
}

const template = fs.readFileSync(templatePath, "utf8");

const pages = {
  "/": { file: "index.html", title: "NEW SAINT VÉRON — Digital Experience & AI", description: "Consultoria premium de Digital Experience e Inteligência Artificial para empresas e marcas. Estratégia, design e engenharia para experiências digitais e soluções de IA.", h1: "Experiências que definem o extraordinário.", body: "A NEW SAINT VÉRON une estratégia, design e engenharia de inteligência artificial para transformar ambição em produto — com o rigor de um estúdio e a precisão de uma consultoria. Atuamos em Experiência Digital e Inteligência Artificial aplicada, criando marcas, interfaces, produtos digitais, automações e sistemas inteligentes com foco em excelência, segurança, acessibilidade e performance.", links: ["/servicos", "/digital-experience", "/inteligencia-artificial", "/contato"] },
  "/servicos": { file: "servicos.html", title: "Serviços — NEW SAINT VÉRON", description: "Serviços premium da NEW SAINT VÉRON em Digital Experience e Inteligência Artificial, entregues como produtos de software de produção.", h1: "Duas frentes. Um padrão de excelência.", body: "A NEW SAINT VÉRON atua onde experiência digital e inteligência artificial se encontram. Em Digital Experience, construímos identidade, interface e produto digital como um sistema coeso, do posicionamento ao pixel final. Em Artificial Intelligence, aplicamos assistentes, automação, integração de LLMs, pipelines de dados e governança a problemas reais de negócio. Cada frente é tratada como produto de software de produção, com estratégia, design, engenharia, segurança, acessibilidade e performance.", links: ["/digital-experience", "/inteligencia-artificial", "/contato"] },
  "/digital-experience": { file: "digital-experience.html", title: "Digital Experience — NEW SAINT VÉRON", description: "Digital Experience pela NEW SAINT VÉRON: identidade, interface e produto digital construídos como um sistema coeso, do posicionamento ao pixel final.", h1: "Digital Experience com intenção.", body: "Digital Experience é a disciplina da NEW SAINT VÉRON para marcas que precisam transformar posicionamento em experiência digital. Trabalhamos estratégia de marca digital, design systems, UX/UI, sites e plataformas premium, prototipação, validação e engenharia front-end de alto padrão. Cada decisão de interface parte de uma tese de posicionamento. Estética é consequência da estratégia, enquanto velocidade, acessibilidade, segurança e fluidez fazem parte do produto final.", links: ["/servicos", "/inteligencia-artificial", "/contato"] },
  "/inteligencia-artificial": { file: "inteligencia-artificial.html", title: "Inteligência Artificial — NEW SAINT VÉRON", description: "IA aplicada pela NEW SAINT VÉRON: assistentes, automação, integração de LLMs e produtos inteligentes com governança e segurança.", h1: "Inteligência artificial aplicada ao que importa.", body: "A NEW SAINT VÉRON aplica inteligência artificial a problemas concretos de negócio. Desenvolvemos assistentes e copilotos sob medida, automações de processos, integrações de LLMs, pipelines de dados e RAG, além de estratégias de governança e segurança. IA entra quando resolve um problema real — não como enfeite. Da prova de conceito ao produto, combinamos estratégia, engenharia e experiência para transformar tecnologia em vantagem operacional.", links: ["/servicos", "/digital-experience", "/contato"] },
  "/contato": { file: "contato.html", title: "Contato — NEW SAINT VÉRON", description: "Entre em contato com a NEW SAINT VÉRON para conversar sobre Digital Experience, Inteligência Artificial e produtos digitais de alto padrão.", h1: "Vamos conversar sobre o que vem depois.", body: "Se sua marca precisa de uma experiência digital mais estratégica, de um produto digital de alto padrão ou de inteligência artificial aplicada ao negócio, a NEW SAINT VÉRON está pronta para iniciar a conversa. Entendemos contexto, público, ambição e problema antes de propor qualquer solução. O primeiro passo é alinhar o desafio e descobrir onde estratégia, design e engenharia podem gerar mais valor.", links: ["/servicos", "/digital-experience", "/inteligencia-artificial"] },
  "/politica-de-privacidade": { file: "politica-de-privacidade.html", title: "Política de Privacidade — NEW SAINT VÉRON", description: "Política de Privacidade da NEW SAINT VÉRON.", h1: "Política de Privacidade", body: "Esta página apresenta as diretrizes de privacidade da NEW SAINT VÉRON para tratamento de informações e dados relacionados ao uso do site e aos contatos realizados por seus canais digitais.", links: ["/", "/contato"] },
  "/politica-de-cookies": { file: "politica-de-cookies.html", title: "Política de Cookies — NEW SAINT VÉRON", description: "Política de Cookies da NEW SAINT VÉRON.", h1: "Política de Cookies", body: "Esta página explica o uso de cookies e tecnologias relacionadas no ambiente digital da NEW SAINT VÉRON, incluindo suas finalidades e possibilidades de controle pelo visitante.", links: ["/", "/contato"] },
  "/termos-de-uso": { file: "termos-de-uso.html", title: "Termos de Uso — NEW SAINT VÉRON", description: "Termos de Uso do site da NEW SAINT VÉRON.", h1: "Termos de Uso", body: "Esta página reúne as condições gerais aplicáveis ao uso do site da NEW SAINT VÉRON, incluindo responsabilidades, propriedade intelectual e regras de utilização do conteúdo disponibilizado.", links: ["/", "/contato"] }
};

function esc(value) { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }

function render(page, route) {
  const canonical = `https://newsaintveron.vercel.app${route === "/" ? "/" : route}`;
  const nav = page.links.map((link) => `<a href="${link}">${link === "/" ? "Início" : link.replace(/^\//, "").replace(/-/g, " ")}</a>`).join(" · ");
  const staticRoot = `<main><article><p>NEW SAINT VÉRON</p><h1>${esc(page.h1)}</h1><p>${esc(page.body)}</p><nav aria-label="Navegação relacionada">${nav}</nav></article></main>`;
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(page.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/i, `<meta name="description" content="${esc(page.description)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${esc(page.title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${esc(page.description)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/i, `<meta name="twitter:title" content="${esc(page.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/i, `<meta name="twitter:description" content="${esc(page.description)}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/i, "");
  html = html.replace(/<\/head>/i, `    <link rel="canonical" href="${canonical}" />\n    </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${staticRoot}</div>`);
  return html;
}

for (const [route, page] of Object.entries(pages)) fs.writeFileSync(path.join(buildDir, page.file), render(page, route), "utf8");
console.log(`Generated ${Object.keys(pages).length} SEO HTML entry points.`);
