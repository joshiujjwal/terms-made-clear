import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Terms Made Clear | An honest starting point",
    template: "%s | Terms Made Clear",
  },
  description:
    "Explore a curated directory of apps, websites, and projects. See what has not been reviewed before relying on policy explanations.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/" aria-label="Terms Made Clear home">
              terms made clear
              <span className="brand-stop" aria-hidden="true">
                .
              </span>
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/services/">Catalog</Link>
              <Link href="/submit/">Suggest a source</Link>
              <Link href="/methodology/">Methodology</Link>
              <Link href="/corrections/">Corrections</Link>
            </nav>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <div className="shell footer-inner">
            <div>
              <Link className="footer-brand" href="/">
                Terms made clear.
              </Link>
              <p>Informational summaries, not legal advice.</p>
            </div>
            <p className="footer-note">
              Independent catalog preview.
              <br />
              Not affiliated with the listed services.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
