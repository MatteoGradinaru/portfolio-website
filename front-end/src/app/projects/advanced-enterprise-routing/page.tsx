"use client";

import Link from "next/link";
import NetworkExplorer from "@/components/ui/NetworkExplorer";

export default function AdvancedEnterpriseRouting() {
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

      <h1 className="section-title" style={{ margin: "10px 0 5px 0", color: "#000" }}>
        Advanced Enterprise Routing & MPLS Backbone
      </h1>
      <p
        style={{
          color: "#0070f3",
          fontWeight: "600",
          fontSize: "1rem",
          marginBottom: "15px",
        }}
      >
        Advanced Networking & Security Specialization Project
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
          This project simulates a service provider core and multi-tenant
          enterprise network environment in GNS3. The infrastructure was built
          in two main phases: IS-IS routing for the internal gateways, and an
          MPLS backbone for customer separation.
        </p>
        <p>
          I configured IS-IS (Level 1/2) routing with wide metrics, established
          internal and external BGP peerings (iBGP/eBGP), and achieved client
          isolation through VRF-Lite Finally, I layered an MPLS L3VPN tunnel
          over the backbone using LDP and MP-BGP, securing it via a site-to-site
          IPsec tunnel (using IKEv2 encryption) directly between the customer
          edge (CE) routers.
        </p>
      </div>

      <div style={{ margin: "40px 0" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
          Interactive Network Topology Explorer
        </h2>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "15px" }}>
          Filter by layer (IS-IS, BGP, VRF, etc.) and click on the network
          routers to view their live interface IPs and routing configuration
          flags. Use Ctrl + scroll to zoom.
        </p>
        <NetworkExplorer />
      </div>

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #eee",
          paddingTop: "30px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Technical Highlights & Skills</h3>
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
              borderLeft: "4px solid #0070f3",
            }}
          >
            <strong>IGP Core (IS-IS)</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Configured IS-IS L1/L2 routing with loopback interfaces as Net
              Entities and adjusted metrics for path preference.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #0070f3",
            }}
          >
            <strong>MPLS / LDP</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Activated Label Distribution Protocol (LDP) across the backbone,
              mapping loopbacks for label propagation.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #0070f3",
            }}
          >
            <strong>MP-BGP & VPNv4</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Peer-to-peer BGP sessions for exchanging VPNv4 routes with target
              communities (Route Distinguishers & Route Targets).
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #0070f3",
            }}
          >
            <strong>CE-to-CE Security (IPsec)</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Created a secure virtual tunnel over the untrusted carrier,
              utilizing IKEv2 profiles and strong cryptographic proposals.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
