import { useEffect } from "react";

/**
 * Utility: safely create or update a <meta> / <link> tag dynamically.
 */
const setMeta = (selector, attr, value) => {
  if (!value) return;

  let el = document.head.querySelector(selector);

  // Create if it doesn’t exist
  if (!el) {
    if (selector.startsWith('meta[')) {
      el = document.createElement('meta');
      const match = selector.match(/\[(name|property)="([^"]+)"\]/);
      if (match) {
        const [, key, val] = match;
        el.setAttribute(key, val);
      }
      document.head.appendChild(el);
    } else if (selector.startsWith('link[')) {
      el = document.createElement('link');
      const relMatch = selector.match(/\[rel="([^"]+)"\]/);
      if (relMatch) el.setAttribute('rel', relMatch[1]);
      document.head.appendChild(el);
    }
  }

  // Update value
  if (el) el.setAttribute(attr, value);
};

/**
 * SEO Component
 * Injects dynamic <meta>, <title>, and JSON-LD schema tags.
 *
 * Usage:
 * <SEO
 *   title="NITS Esports | Team"
 *   description="Meet our team..."
 *   image="https://..."
 *   canonical="https://nitsesports.in/team"
 *   robots="index, follow"
 *   structuredData={{ "@context": "https://schema.org", "@type": "Organization", ... }}
 * />
 */
export default function SEO({
  title,
  description,
  image,
  robots = "index, follow",
  canonical,
  twitterCard = "summary_large_image",
  structuredData,
}) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // --- Title ---
    const fullTitle = title?.trim();
    if (fullTitle) {
      document.title = fullTitle;
      setMeta('meta[property="og:title"]', "content", fullTitle);
      setMeta('meta[name="twitter:title"]', "content", fullTitle);
    }

    // --- Description ---
    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }

    // --- URL / Canonical ---
    const url =
      canonical ||
      (typeof window !== "undefined" ? window.location.href.split("?")[0] : "");
    if (url) {
      setMeta('meta[property="og:url"]', "content", url);
      setMeta('link[rel="canonical"]', "href", url);
    }

    // --- Image / Preview ---
    if (image) {
      setMeta('meta[property="og:image"]', "content", image);
      setMeta('meta[name="twitter:image"]', "content", image);
    }

    // --- Type / Robots / Twitter card ---
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[name="robots"]', "content", robots);
    setMeta('meta[name="twitter:card"]', "content", twitterCard);

    // --- Structured Data (JSON-LD) ---
    const scriptId = "seo-structured-data";
    const oldScript = document.getElementById(scriptId);
    if (oldScript) oldScript.remove();

    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      script.text = JSON.stringify(structuredData, null, 2);
      document.head.appendChild(script);
    }
  }, [title, description, image, robots, canonical, twitterCard, structuredData]);

  return null;
}
