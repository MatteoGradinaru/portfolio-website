"use client";

import Link from "next/link";

const projectList = [
  {
    id: "advanced-enterprise-routing",
    title: "Advanced Enterprise Routing & MPLS Backbone",
    specialization: "Advanced Networking & Security",
    desc: "A hands-on network engineering project simulating a service provider backbone and enterprise network in GNS3. Integrates IS-IS core routing, BGP peerings, VRF isolation, and secure site-to-site IPsec tunnels.",
    tags: ["GNS3", "IS-IS", "iBGP/eBGP", "MPLS", "VRF-Lite", "IPsec (IKEv2)"],
    color: "#0070f3",
    link: "/projects/advanced-enterprise-routing",
  },
  {
    id: "secure-enterprise-wireless",
    title: "Secure Enterprise Wireless LAN (WLAN) Infrastructure",
    specialization: "Wireless Communication",
    desc: "Implementation of a secure, segmented wireless network running on virtualized Proxmox infrastructure. Integrates a physical Cisco AP, a virtual Cisco Catalyst WLC, FreeRADIUS 802.1X, and OPNsense firewall routing.",
    tags: [
      "Proxmox VE",
      "Cisco WLC",
      "FreeRADIUS",
      "OPNsense",
      "VLANs",
      "WPA3",
    ],
    color: "#2979ff",
    link: "/projects/secure-enterprise-wireless",
  },
  {
    id: "ku-leuven-event-registration",
    title: "KU Leuven Event Registration & Attendance Management System",
    specialization: "Software Development",
    desc: "A full-stack agile web application built for KU Leuven event coordinators. Features a chatbot-style registration flow, automated secure QR emails, and a live web check-in console with sound-alert scanner feedback.",
    tags: [
      "Spring Boot",
      "Java 21",
      "Next.js",
      "React 19",
      "ZXing QR",
      "Agile/Scrum",
    ],
    color: "#a07cf8",
    link: "/projects/ku-leuven-event-registration",
  },
  {
    id: "autonomous-smart-firetruck",
    title: "Autonomous Smart Firetruck & Real-Time IoT Dashboard",
    specialization: "IoT & DevOps Infrastructure",
    desc: "A collaborative robotics and systems integration project. Connects ESP32 telemetry sensors to containerized Next.js/Spring Boot servers deployed on OKD (OpenShift Distribution) via GitHub Actions CI/CD pipelines.",
    tags: [
      "ESP32",
      "WebSockets (STOMP)",
      "GitHub Actions",
      "OKD / Kubernetes",
      "Docker",
      "Flyway",
    ],
    color: "#ffab40",
    link: "/projects/autonomous-smart-firetruck",
  },
];

export default function Projects() {
  return (
    <section className="section">
      <div style={{ textAlign: "left", marginBottom: "45px" }}>
        <h1
          className="section-title"
          style={{
            fontSize: "2.5rem",
            marginBottom: "20px",
            color: "var(--heading-color)",
          }}
        >
          My Projects
        </h1>
        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-main)",
            maxWidth: "700px",
            lineHeight: "1.7",
          }}
        >
          Here is a selection of the projects I've worked on. They cover
          everything from setting up enterprise routing tables and configuring
          secure wireless networks to building full-stack applications and
          working with IoT devices. Click on any card below to read the details
          or play around with the interactive topologies.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "25px",
        }}
      >
        {projectList.map((project) => (
          <div
            key={project.id}
            className="contact-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = project.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
            style={{
              flexDirection: "column",
              alignItems: "stretch",
              height: "100%",
              gap: 0,
            }}
          >
            {/* Specialization Badge */}
            <div style={{ marginBottom: "12px" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: project.color,
                  backgroundColor: `${project.color}15`,
                  padding: "4px 10px",
                  borderRadius: "20px",
                }}
              >
                {project.specialization}
              </span>
            </div>

            {/* Project Title */}
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                marginBottom: "12px",
                lineHeight: "1.4",
                color: "var(--heading-color)",
              }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                marginBottom: "20px",
                flexGrow: 1,
              }}
            >
              {project.desc}
            </p>

            {/* Technology Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "24px",
              }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    backgroundColor: "var(--bg-color)",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: `1px solid ${project.color}60`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Link Button */}
            <div>
              <Link
                href={project.link}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  backgroundColor: "var(--heading-color)",
                  color: "var(--inverse-text)",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  transition: "background-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = project.color;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--heading-color)";
                  e.currentTarget.style.color = "var(--inverse-text)";
                }}
              >
                View Project Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
