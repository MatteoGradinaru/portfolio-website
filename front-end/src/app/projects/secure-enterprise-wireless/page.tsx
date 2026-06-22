"use client";

import Link from "next/link";
import WirelessExplorer from "@/components/ui/WirelessExplorer";

export default function SecureEnterpriseWireless() {
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
        Secure Enterprise Wireless LAN (WLAN) Infrastructure
      </h1>
      <p
        style={{
          color: "#2979ff",
          fontWeight: "600",
          fontSize: "1rem",
          marginBottom: "15px",
        }}
      >
        Wireless Communication Specialization Project
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
          This project involved implementing a production-grade, secure,
          segmented wireless LAN infrastructure. The core network was
          containerized and virtualized inside a Proxmox VE environment, bridged
          to a physical managed switch and a hardware Cisco Catalyst Access
          Point.
        </p>
        <p>
          I deployed a virtual Cisco Catalyst 9800-CL Wireless Controller (WLC)
          to coordinate AP radios. The infrastructure hosts three separate SSIDs
          (Corporate, Guest, IoT) mapped to different VLANs. Security measures
          include WPA3-Enterprise (802.1X EAP-PEAP) authentication against a
          custom FreeRADIUS server, a localized Web Captive Portal (LWA) for
          guest visitors, and strict inter-VLAN firewall rules inside an
          OPNsense router.
        </p>
      </div>

      <div style={{ margin: "40px 0" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
          Interactive Wireless Topology Explorer
        </h2>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "15px" }}>
          Explore the integration between virtual hypervisors and physical
          network hardware. Click on the devices or filter by layer to inspect
          configurations.
        </p>
        <WirelessExplorer />
      </div>

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #eee",
          paddingTop: "30px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Key Implementation Details</h3>
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
              borderLeft: "4px solid #2979ff",
            }}
          >
            <strong>Cisco Catalyst WLC (9800-CL)</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Configured profile policies, RF tags, and AP join profiles using
              DHCP Option 43 overrides for CAPWAP discovery.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #2979ff",
            }}
          >
            <strong>FreeRADIUS (802.1X)</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Deployed FreeRADIUS inside a Linux LXC container, configuring
              clients and authentication profiles for EAP security protocols.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #2979ff",
            }}
          >
            <strong>Firewall & Gateways</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Managed inter-VLAN blocking policies in OPNsense to prevent IoT or
              Guest clients from pinging or reaching management networks.
            </p>
          </li>
          <li
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #2979ff",
            }}
          >
            <strong>Physical VLAN trunking</strong>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Configured Cisco Switch interfaces with trunk encapsulation,
              matching native VLAN commands on uplink interfaces.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
