import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";

const STORAGE_KEY = "nsv_cookie_consent";
const GA4_ID = process.env.REACT_APP_GA4_ID || "";

export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Loads GA4 only after analytics consent AND a configured measurement id.
function loadAnalytics(consent) {
  if (!consent?.analytics || !GA4_ID) return;
  if (document.getElementById("ga4-src")) return;
  const s = document.createElement("script");
  s.id = "ga4-src";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA4_ID, { anonymize_ip: true });
}

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    } else {
      loadAnalytics(stored);
    }
  }, []);

  const persist = (consent) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...consent, ts: Date.now() })
      );
    } catch {
      /* ignore storage errors */
    }
    loadAnalytics(consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      data-testid="cookie-banner"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-[6px] border border-white/10 bg-graphite/95 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl md:p-8"
    >
      <p className="text-overline text-champagne">Privacidade</p>
      <p className="mt-3 font-sans text-sm leading-relaxed text-ivory-muted">
        Usamos cookies essenciais para o funcionamento do site e, com o seu
        consentimento, cookies de análise para entender o uso e melhorar a
        experiência. Você decide.{" "}
        <Link
          to="/politica-de-cookies"
          className="text-ivory underline decoration-champagne/50 underline-offset-4 hover:text-champagne"
          data-testid="cookie-policy-link"
        >
          Política de Cookies
        </Link>
        .
      </p>

      {showPrefs && (
        <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
          <label className="flex items-center justify-between gap-4">
            <span className="font-sans text-sm text-ivory">
              Cookies essenciais
              <span className="block text-xs text-ivory-muted">
                Necessários — sempre ativos.
              </span>
            </span>
            <input
              type="checkbox"
              checked
              disabled
              className="h-4 w-4 accent-champagne"
              aria-label="Cookies essenciais (sempre ativos)"
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span className="font-sans text-sm text-ivory">
              Cookies de análise
              <span className="block text-xs text-ivory-muted">
                Ajudam a entender o uso do site (GA4).
              </span>
            </span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="h-4 w-4 accent-champagne"
              data-testid="cookie-analytics-toggle"
              aria-label="Cookies de análise"
            />
          </label>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          variant="primary"
          size="sm"
          onClick={() => persist({ essential: true, analytics: true })}
          data-testid="cookie-accept-all-btn"
        >
          Aceitar tudo
        </Button>
        {showPrefs ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => persist({ essential: true, analytics })}
            data-testid="cookie-save-prefs-btn"
          >
            Salvar preferências
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrefs(true)}
            data-testid="cookie-customize-btn"
          >
            Personalizar
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => persist({ essential: true, analytics: false })}
          data-testid="cookie-reject-btn"
        >
          Rejeitar não essenciais
        </Button>
      </div>
    </div>
  );
};
