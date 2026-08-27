import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import DigitalExperience from "@/pages/DigitalExperience";
import ArtificialIntelligence from "@/pages/ArtificialIntelligence";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import CookiePolicy from "@/pages/CookiePolicy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/digital-experience" element={<DigitalExperience />} />
          <Route path="/inteligencia-artificial" element={<ArtificialIntelligence />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/politica-de-privacidade" element={<Privacy />} />
          <Route path="/politica-de-cookies" element={<CookiePolicy />} />
          <Route path="/termos-de-uso" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#1C1C1C",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F5F5F0",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
