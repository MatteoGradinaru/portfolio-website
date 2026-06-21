"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const screenshots = [
  { src: "/s1.png", title: "Login Interface" },
  { src: "/s2.png", title: "Admin Dashboard" },
  { src: "/s3.png", title: "User view registration" },
  { src: "/s4.png", title: "Registration Chatbot" },
  { src: "/s5.png", title: "QR Code Scanner" },
];

export default function KuLeuvenEventRegistration() {
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (activeScreenshotIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveScreenshotIdx(null);
      } else if (e.key === "ArrowLeft") {
        setActiveScreenshotIdx((prev) =>
          prev === null
            ? null
            : (prev - 1 + screenshots.length) % screenshots.length,
        );
      } else if (e.key === "ArrowRight") {
        setActiveScreenshotIdx((prev) =>
          prev === null ? null : (prev + 1) % screenshots.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // lock background scrolling

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeScreenshotIdx]);

  return (
    <section
      className="section"
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      <div style={{ marginBottom: "25px" }}>
        <Link
          href="/projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#666",
            fontSize: "0.95rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0070f3")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
        >
          ← Back to Projects
        </Link>
      </div>

      <h1 className="section-title" style={{ margin: "10px 0 5px 0" }}>
        KU Leuven Event Registration & Attendance Management System
      </h1>
      <p
        style={{
          color: "#a07cf8",
          fontWeight: "600",
          fontSize: "1rem",
          marginBottom: "15px",
        }}
      >
        Agile Full-Stack Software Development Project
      </p>

      <div
        style={{
          color: "#555",
          fontSize: "1.05rem",
          lineHeight: "1.6",
          marginBottom: "30px",
        }}
      >
        <p style={{ marginBottom: "15px" }}>
          This system is a multi-role full-stack application built for KU Leuven
          to coordinate trial course registrations for prospective students.
          Developed in an agile scrum team of 6 students (3 juniors, 3 seniors),
          I worked as a Junior Developer focusing on the Spring Boot backend API
          development and the Next.js / TypeScriptfrontend components.
        </p>
        <p style={{ marginBottom: "15px" }}>
          Key modules include a highly interactive, chatbot-style sliding
          registration panelthat parses address validation rules dynamically,
          automated HTML email confirmations containing a ZXing secure check-in
          QR code attachment, and an administrative portal providing XML
          imports/exports alongside color theme customizations.
        </p>
        <p>
          Additionally, we developed a real-time webcam-based QR code check-in
          console for physical event organizers using browser camera scanning
          and sound chime integrations to log attendees instantly.
        </p>
      </div>

      <div style={{ margin: "40px 0" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
          System Screenshots
        </h2>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "15px" }}>
          Click on any slide to open the fullscreen lightbox viewer and browse
          the system interfaces:
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          {screenshots.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveScreenshotIdx(idx)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #ddd",
                backgroundColor: "#161b22",
                aspectRatio: "16/9",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <img
                src={img.src}
                alt={img.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.85)",
                  color: "#fff",
                  padding: "6px 10px",
                  fontSize: "0.75rem",
                  textAlign: "center",
                  borderTop: "1px solid #222",
                }}
              >
                {img.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #eee",
          paddingTop: "30px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>
          Technical Highlights & Features
        </h3>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "15px",
            padding: 0,
          }}
        >
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #a07cf8",
            }}
          >
            <strong>Conversational Chat Form</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Replaced static registration inputs with a dynamic conversational
              UI. Enforces a 10-minute timeout reservation window.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #a07cf8",
            }}
          >
            <strong>Secure QR Code Generator</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Leveraged Java ZXing libraries and mail-send profiles to construct
              encrypted token QR attachments in automated HTML emails.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #a07cf8",
            }}
          >
            <strong>In-Browser Camera Scanning</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Integrated camera readers with custom audio chime feedback and
              duplicate-scan protection to enable smooth reception operations.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #a07cf8",
            }}
          >
            <strong>Security & Imports</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Configured JWT stateless route policies in Spring Security, XML
              parser uploads using Jackson XmlMapper, and PostgreSQL databases.
            </p>
          </li>
        </ul>
      </div>

      {/* Lightbox Modal Overlay for Screenshots */}
      {activeScreenshotIdx !== null && (
        <div
          onClick={() => setActiveScreenshotIdx(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: "20px",
          }}
        >
          {/* Close button at top right */}
          <button
            onClick={() => setActiveScreenshotIdx(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "0.9rem",
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "600",
              zIndex: 10002,
            }}
          >
            ✕ Close (Esc)
          </button>

          {/* Left Navigation Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveScreenshotIdx((prev) =>
                prev === null
                  ? null
                  : (prev - 1 + screenshots.length) % screenshots.length,
              );
            }}
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid #444",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              color: "#fff",
              fontSize: "1.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10002,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
            }
          >
            ⟨
          </button>

          {/* Image Content Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "80%",
              maxHeight: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={screenshots[activeScreenshotIdx].src}
              alt={screenshots[activeScreenshotIdx].title}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "8px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                border: "1px solid #333",
              }}
            />
            <div
              style={{
                marginTop: "10px",
                color: "#fff",
                fontSize: "0.9rem",
                fontWeight: "500",
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
            >
              {screenshots[activeScreenshotIdx].title} (
              {activeScreenshotIdx + 1} / {screenshots.length})
            </div>
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveScreenshotIdx((prev) =>
                prev === null ? null : (prev + 1) % screenshots.length,
              );
            }}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid #444",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              color: "#fff",
              fontSize: "1.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10002,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
            }
          >
            ⟩
          </button>
        </div>
      )}
    </section>
  );
}
