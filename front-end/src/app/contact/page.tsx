"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaCopy,
  FaCheck,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "testmail@example.com";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="section"
      style={{ textAlign: "left", maxWidth: "800px" }}
    >
      <h2
        className="section-title"
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: "var(--heading-color)",
        }}
      >
        Let's Connect
      </h2>
      <p
        style={{
          marginBottom: "40px",
          fontSize: "1.15rem",
          lineHeight: "1.7",
          color: "var(--text-main)",
        }}
      >
        The best projects start with a simple conversation. Find me on any of
        the platforms below and let’s connect.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Email */}
        <div
          className="contact-card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a
            href={`mailto:${email}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className="contact-icon-wrapper">
              <FaEnvelope size={24} color="var(--heading-color)" />
            </div>
            <div>
              <span className="contact-text-label">Email</span>
              <span className="contact-text-value">{email}</span>
            </div>
          </a>

          <button
            onClick={handleCopy}
            className="contact-copy-btn"
            title="Copy to clipboard"
            aria-label="Copy email to clipboard"
          >
            {copied ? (
              <>
                <FaCheck size={16} color="#10B981" />
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#10B981",
                    fontWeight: 600,
                  }}
                >
                  Copied!
                </span>
              </>
            ) : (
              <>
                <FaCopy size={16} color="var(--heading-color)" />
                <span
                  style={{ fontSize: "0.9rem", color: "var(--heading-color)" }}
                >
                  Copy
                </span>
              </>
            )}
          </button>
        </div>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/gradinaru-matteo"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div className="contact-icon-wrapper">
              <FaLinkedin size={24} color="var(--heading-color)" />
            </div>
            <div>
              <span className="contact-text-label">LinkedIn</span>
              <span className="contact-text-value">gradinaru-matteo</span>
            </div>
          </div>

          <FaExternalLinkAlt
            size={16}
            color="var(--heading-color)"
            style={{ opacity: 0.6, marginRight: "5px" }}
          />
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/matteogradinaru"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div className="contact-icon-wrapper">
              <FaGithub size={24} color="var(--heading-color)" />
            </div>
            <div>
              <span className="contact-text-label">GitHub</span>
              <span className="contact-text-value">matteogradinaru</span>
            </div>
          </div>

          <FaExternalLinkAlt
            size={16}
            color="var(--heading-color)"
            style={{ opacity: 0.6, marginRight: "5px" }}
          />
        </a>
      </div>
    </section>
  );
}
