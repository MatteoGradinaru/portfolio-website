"use client";

import Link from "next/link";
import FiretruckExplorer from "@/components/ui/FiretruckExplorer";

export default function AutonomousSmartFiretruck() {
  return (
    <section className="section">
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

      <h1
        className="section-title"
        style={{ margin: "10px 0 5px 0", color: "#000" }}
      >
        Autonomous Smart Firetruck & Real-Time IoT Dashboard
      </h1>
      <p
        style={{
          color: "#ffab40",
          fontWeight: "600",
          fontSize: "1rem",
          marginBottom: "15px",
        }}
      >
        IoT, Robotics & Infrastructure Integration Project
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
          In this collaborative IoT project, our team of 5 students built an
          autonomous smart firetruck robot. The physical firetruck uses an ESP32
          microcontroller, flame sensors to detect fire direction, and a
          motor-pump system to extinguish target fires.
        </p>
        <p>
          As the Integration & DevOps Engineer, I designed the system's
          infrastructure. I connected the hardware sensors to the backend by
          writing WebSocket STOMP clients, streaming live metrics (such as flame
          status and water tank levels) to the web dashboard. For deployment, I
          built automated CI/CD pipelines in GitHub Actions and deployed our
          containerized services across Staging and Production environments in
          OKD (OpenShift Kubernetes Distribution).
        </p>
      </div>

      <div style={{ margin: "40px 0" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
          Deployment & Pipeline Topology Explorer
        </h2>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "15px" }}>
          Interactive map of the software delivery pipeline and OKD routing.
          Click on the nodes to see deployment configurations, yaml specs, and
          firmware codes.
        </p>
        <FiretruckExplorer />
      </div>

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #eee",
          paddingTop: "30px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>
          Infrastructure & Integration Details
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
              borderLeft: "4px solid #ffab40",
            }}
          >
            <strong>Container Orchestration (OKD)</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Configured namespaces, deployment pods with replicas, services,
              and route resources to route ingress traffic to the React and
              Spring Boot servers.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #ffab40",
            }}
          >
            <strong>Automated CI/CD</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Built multi-stage workflows in GitHub Actions to compile packages,
              trigger tests, build Docker containers, and issue commands to the
              cluster API.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #ffab40",
            }}
          >
            <strong>WebSocket Telemetry</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Wrote firmware WebSocket libraries on ESP32 to push telemetry
              payloads containing device IDs, water capacity percentages, and
              status alerts.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #ffab40",
            }}
          >
            <strong>Reliability & Fallbacks</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Configured persistent heartbeats on the hardware client. If no
              signal is received by the broker within 30 seconds, it triggers an
              offline warning on the dashboard.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
