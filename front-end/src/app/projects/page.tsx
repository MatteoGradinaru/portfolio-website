"use client";

import { useState, useEffect } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import NetworkExplorer from "@/components/ui/NetworkExplorer";
import WirelessExplorer from "@/components/ui/WirelessExplorer";
import FiretruckExplorer from "@/components/ui/FiretruckExplorer";

const screenshots = [
  { src: "/s1.png", title: "Login Interface" },
  { src: "/s2.png", title: "Admin Dashboard" },
  { src: "/s3.png", title: "User view registration" },
  { src: "/s4.png", title: "Registration Chatbot" },
  { src: "/s5.png", title: "QR Code Scanner" },
];

export default function Projects() {
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
    <section className="section">
      <h2 className="section-title">My Projects</h2>
      <p>
        Here are some of the projects I have worked on during my studies at UC
        Leuven Limburg.
      </p>

      <ProjectCard
        title="Advanced Enterprise Routing & MPLS Backbone"
        description="A hands-on project simulating a service provider network inside GNS3. I started by building an enterprise network using IS-IS routing, eBGP and iBGP internet peerings, and VRF-lite for customer isolation. Then, I set up an MPLS L3VPN backbone using LDP and MP-BGP to route customer traffic. To secure the connection, I configured a site-to-site IPsec tunnel with IKEv2 encryption directly between the customer edge routers, ensuring the service provider core cannot read the private data."
      >
        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#888" }}>
          Interact with the topology below for a better experience.
        </p>

        <NetworkExplorer />
      </ProjectCard>

      <ProjectCard
        title="Secure Enterprise Wireless LAN (WLAN) Infrastructure"
        description="This project was about building a secure, segmented wireless network on Proxmox. I set up a physical Cisco Access Point and configured a virtual Cisco Catalyst 9800-CL Wireless Controller (WLC). I split the network into three separate SSIDs (Corporate, Guest, IoT) mapped to different VLANs. To secure the networks, I set up an LXC container running FreeRADIUS for WPA3-Enterprise (802.1X) authentication, configured a local web portal (LWA) for guests, and defined firewall rules in OPNsense to keep guest and IoT traffic isolated from the corporate subnet."
      >
        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#888" }}>
          Interact with the topology below for a better experience.
        </p>

        <WirelessExplorer />
      </ProjectCard>

      <ProjectCard
        title="KU Leuven Event Registration & Attendance Management System"
        description="A full-stack web application built for KU Leuven to coordinate trial course registrations for prospective students. The project was developed in an agile team consisting of 3 seniors (who managed Scrum, Product Owner roles, DevOps, and CI/CD pipelines) and 3 juniors. As a junior developer, I focused on programming the Spring Boot Java backend and the Next.js frontend. The system features a chatbot-style student registration form, an administrative dashboard to control course visibility, and a browser-based QR code webcam scanner for real-time check-ins."
      >
        <div style={{ marginTop: "15px" }}>
          <p
            style={{ fontSize: "0.9rem", color: "#888", marginBottom: "12px" }}
          >
            Click on any screenshot to view it in full screen:
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
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #333",
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
      </ProjectCard>

      <ProjectCard
        title="Autonomous Smart Firetruck & Real-Time IoT Dashboard"
        description="An IoT and robotics project where our team of 5 students built an autonomous smart firetruck robot (using ESP32 microcontrollers, flame sensors, and a water tank/spray system) that autonomously navigates to and extinguishes fires. Working as the Integration Engineer alongside a Scrum Master, Product Owner, IoT Engineer, and Security Engineer, I connected the hardware sensors to the backend via WebSockets to stream live telemetry. I also managed the infrastructure by configuring automated CI/CD pipelines in GitHub Actions and deploying the services containerized on Kubernetes and OKD."
      >
        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#888" }}>
          Interact with the topology below for a better experience.
        </p>

        <FiretruckExplorer />
      </ProjectCard>

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
