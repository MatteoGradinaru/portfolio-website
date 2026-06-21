"use client";

export default function About() {
  return (
    <section
      className="section"
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      <h2
        className="section-title"
        style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#000" }}
      >
        About Me
      </h2>

      <div style={{ fontSize: "1.1rem", lineHeight: "1.7", color: "#444" }}>
        <p style={{ marginBottom: "20px" }}>
          Hi, I am Matteo! I am currently in my second year studying Applied
          Computer Science at UC Leuven Limburg (UCLL) in Belgium.
        </p>

        <p style={{ marginBottom: "20px" }}>
          I have chosen IT-Infrastructure as my specialization. I have a deep
          passion for understanding how systems connect and how data is
          transferred securely. I particularly enjoy hands-on courses in
          Advanced Networking & Security and Wireless Communication, where I get
          to construct and troubleshoot virtual and physical topologies.
        </p>

        <p style={{ marginBottom: "35px" }}>
          Alongside infrastructure engineering, my curriculum equips me with a
          strong foundation in modern software development. I have experience
          working with core developer technologies including:
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "25px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            borderLeft: "4px solid #0070f3",
          }}
        >
          <h3
            style={{ fontSize: "1.15rem", marginBottom: "10px", color: "#000" }}
          >
            Infrastructure & Networks
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: "1.6",
            }}
          >
            <li>IS-IS Routing & OSPF Protocols</li>
            <li>BGP (iBGP / eBGP) & MPLS Backbone</li>
            <li>VLAN segmentation & Trunking</li>
            <li>Enterprise Wireless LAN (Cisco WLC)</li>
            <li>RADIUS Authentication & OPNsense Firewalls</li>
          </ul>
        </div>

        <div
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            borderLeft: "4px solid #2979ff",
          }}
        >
          <h3
            style={{ fontSize: "1.15rem", marginBottom: "10px", color: "#000" }}
          >
            Software & Development
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: "1.6",
            }}
          >
            <li>Python Scripting & Automation</li>
            <li>Java & Spring Boot Framework</li>
            <li>Next.js, React & TypeScript</li>
            <li>Data Management & SQL Databases</li>
            <li>Git version control & CI/CD Pipelines</li>
          </ul>
        </div>
      </div>

      <div
        style={{
          fontSize: "1.1rem",
          lineHeight: "1.7",
          color: "#444",
          borderTop: "1px solid #eee",
          paddingTop: "30px",
        }}
      >
        <h3 style={{ fontSize: "1.4rem", color: "#000", marginBottom: "10px" }}>
          My Learning Philosophy
        </h3>
        <p>
          I believe that the best way to master infrastructure engineering is by
          building it. Whether it is configuring virtual routers in GNS3,
          setting up firewalls on Proxmox hypervisors, or orchestrating
          containers in Kubernetes clusters, I enjoy bridging the gap between
          hardware configurations and frontend dashboards.
        </p>
      </div>
    </section>
  );
}
