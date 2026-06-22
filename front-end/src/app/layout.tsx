import type { Metadata } from "next";
import Link from "next/link";
import "../styles/globals.css";
import "../styles/background.css";

import Background from "@/components/layout/Background";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Personal Portfolio",
  description: "Computer Science Student Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
          <Background />
          <div className="container">
            <header className="header">
              <div className="logo">
                <Link href="/">
                  <strong>Portfolio</strong>
                </Link>
              </div>
              <nav style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                <ul className="nav-links">
                  <li>
                    <Link href="/" className="nav-link">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="nav-link">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/projects" className="nav-link">
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="nav-link">
                      Contact
                    </Link>
                  </li>
                </ul>
                <ThemeToggle />
              </nav>
            </header>

            <main>{children}</main>

            <footer className="footer">
              <p>
                &copy; {new Date().getFullYear()} Personal portfolio. All rights
                reserved.
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
