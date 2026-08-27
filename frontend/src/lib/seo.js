import { useEffect } from "react";

const SITE_URL = process.env.REACT_APP_SITE_URL || "https://newsaintveron.com";

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// SEO hook — sets title, description, canonical, OG/Twitter tags per page.
export function useSeo({ title, description, path = "/", ogImage }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} — NEW SAINT VÉRON`
      : "NEW SAINT VÉRON — Digital Experience & AI";
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    setMeta("name", "description", description);
    setCanonical(url);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    if (ogImage) {
      setMeta("property", "og:image", ogImage);
      setMeta("name", "twitter:image", ogImage);
    }

    window.scrollTo(0, 0);
  }, [title, description, path, ogImage]);
}
