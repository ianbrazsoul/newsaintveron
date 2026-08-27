import { LegalPage } from "@/components/legal/LegalPage";

export default function CookiePolicy() {
  return (
    <LegalPage
      seo={{
        title: "Política de Cookies",
        description:
          "Política de Cookies da NEW SAINT VÉRON — quais cookies usamos, para quê e como você controla o seu consentimento.",
        path: "/politica-de-cookies",
      }}
      overline="Legal"
      title="Política de Cookies"
      updated="Junho de 2026"
      sections={[
        {
          paragraphs: [
            "Esta Política de Cookies explica o que são cookies, como a NEW SAINT VÉRON os utiliza e como você pode gerenciar suas preferências.",
          ],
        },
        {
          heading: "1. O que são cookies",
          paragraphs: [
            "Cookies são pequenos arquivos armazenados no seu dispositivo que ajudam o site a funcionar e a entender como ele é utilizado.",
          ],
        },
        {
          heading: "2. Categorias que utilizamos",
          list: [
            "Essenciais: necessários para o funcionamento do site. Sempre ativos.",
            "Análise (opcional): ajudam a entender o uso do site (ex.: Google Analytics 4). Carregados apenas após o seu consentimento.",
          ],
        },
        {
          heading: "3. Consentimento",
          paragraphs: [
            "Ao acessar o site, você recebe um banner de consentimento. Cookies de análise só são ativados se você concordar. Cookies essenciais não exigem consentimento por serem indispensáveis.",
          ],
        },
        {
          heading: "4. Como gerenciar",
          paragraphs: [
            "Você pode aceitar, rejeitar ou personalizar suas preferências no banner de consentimento. Também é possível limpar os cookies diretamente nas configurações do seu navegador.",
          ],
        },
        {
          heading: "5. Contato",
          paragraphs: [
            "Dúvidas sobre esta Política podem ser enviadas para contato@newsaintveron.com.",
          ],
        },
      ]}
    />
  );
}
