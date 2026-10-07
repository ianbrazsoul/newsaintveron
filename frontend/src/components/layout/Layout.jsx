import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { CookieBanner } from "@/components/common/CookieBanner";

export const Layout = () => (
  <div className="App">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[4px] focus:bg-champagne focus:px-4 focus:py-2 focus:text-sm focus:text-obsidian"
      data-testid="skip-to-content"
    >
      Pular para o conteúdo
    </a>
    <Header />
    <main id="main">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppButton />
    <CookieBanner />
  </div>
);
