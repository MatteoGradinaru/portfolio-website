"use client";

export default function About() {
  return (
    <section className="section">
      <h2
        className="section-title"
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: "var(--heading-color)",
        }}
      >
        About Me
      </h2>

      <div
        style={{
          fontSize: "1.15rem",
          lineHeight: "1.7",
          color: "var(--text-main)",
        }}
      >
        <p style={{ marginBottom: "20px" }}>
          I have chosen IT-Infrastructure as my specialization. I have a deep
          passion for understanding how systems connect and how data is
          transferred securely. I particularly enjoy hands-on courses related to
          networking, where I get to construct and troubleshoot virtual and
          physical topologies.
        </p>

        <p style={{ marginBottom: "35px" }}>
          Alongside infrastructure engineering, my courses equip me with a
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
          className="static-card"
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0,
          }}
        >
          <h3
            style={{
              fontSize: "1.15rem",
              marginBottom: "10px",
              color: "var(--heading-color)",
            }}
          >
            Infrastructure & Networks
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "0.95rem",
              color: "var(--text-muted)",
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
          className="static-card"
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0,
          }}
        >
          <h3
            style={{
              fontSize: "1.15rem",
              marginBottom: "10px",
              color: "var(--heading-color)",
            }}
          >
            Software & Development
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "0.95rem",
              color: "var(--text-muted)",
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
    </section>
  );
}
