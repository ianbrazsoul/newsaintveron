import { LegalPage } from "@/components/legal/LegalPage";

export default function Terms() {
  return (
    <LegalPage
      seo={{
        title: "Termos de Uso",
        description:
          "Termos de Uso do site da NEW SAINT VÉRON — condições de uso, propriedade intelectual e limitações de responsabilidade.",
        path: "/termos-de-uso",
      }}
      overline="Legal"
      title="Termos de Uso"
      updated="Junho de 2026"
      sections={[
        {
          paragraphs: [
            "Ao acessar e utilizar este site, você concorda com os Termos de Uso descritos a seguir. Caso não concorde, recomendamos não utilizar o site.",
          ],
        },
        {
          heading: "1. Uso do site",
          paragraphs: [
            "Este site tem caráter informativo e institucional. Você se compromete a utilizá-lo de forma lícita, sem prejudicar seu funcionamento ou terceiros.",
          ],
        },
        {
          heading: "2. Propriedade intelectual",
          paragraphs: [
            "Todo o conteúdo — textos, marca, identidade visual e código — pertence à NEW SAINT VÉRON, salvo indicação em contrário. A reprodução sem autorização é vedada.",
          ],
        },
        {
          heading: "3. Conteúdo e disponibilidade",
          paragraphs: [
            "Empenhamo-nos para manter as informações corretas e atualizadas, mas não garantimos ausência de erros ou disponibilidade ininterrupta do site.",
          ],
        },
        {
          heading: "4. Limitação de responsabilidade",
          paragraphs: [
            "A NEW SAINT VÉRON não se responsabiliza por decisões tomadas com base no conteúdo institucional deste site, tampouco por eventuais indisponibilidades técnicas.",
          ],
        },
        {
          heading: "5. Alterações",
          paragraphs: [
            "Estes Termos podem ser atualizados a qualquer momento. A versão vigente estará sempre disponível nesta página.",
          ],
        },
        {
          heading: "6. Contato",
          paragraphs: [
            "Dúvidas sobre estes Termos podem ser enviadas para contato@newsaintveron.com.",
          ],
        },
      ]}
    />
  );
}
