import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Contact() {
  return (
    <section
      className="section"
      style={{ textAlign: "left", maxWidth: "800px", padding: "40px 0" }}
    >
      <h2
        className="section-title"
        style={{ color: "var(--heading-color)", marginBottom: "20px" }}
      >
        Let's Connect
      </h2>
      <p
        style={{
          marginBottom: "40px",
          fontSize: "1.1rem",
          lineHeight: "1.6",
          color: "var(--text-color, #555)",
        }}
      >
        I'm always open to discussing new projects, creative ideas or
        opportunities to be part of your visions. Feel free to reach out through
        any of the platforms below!
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Email */}
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
          style={linkStyle}
        >
          <div style={iconWrapperStyle}>
            <FaEnvelope size={24} color="var(--heading-color)" />
          </div>
          <span style={textStyle}>Email me</span>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/gradinaru-matteo"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          <div style={iconWrapperStyle}>
            <FaLinkedin size={24} color="var(--heading-color)" />
          </div>
          <span style={textStyle}>LinkedIn profile</span>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/MatteoGradinaru-UCLL"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          <div style={iconWrapperStyle}>
            <FaGithub size={24} color="var(--heading-color)" />
          </div>
          <span style={textStyle}>GitHub repositories</span>
        </a>
      </div>
    </section>
  );
}

// Styling objects for cleaner JSX
const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "15px 25px",
  borderRadius: "12px",
  backgroundColor: "rgba(128, 128, 128, 0.08)", // Works nicely in light & dark mode
  textDecoration: "none",
  color: "inherit",
  transition: "all 0.2s ease-in-out",
  border: "1px solid rgba(128, 128, 128, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
};

const iconWrapperStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: "rgba(128, 128, 128, 0.15)",
};

const textStyle = {
  fontSize: "1.2rem",
  fontWeight: 500,
  color: "var(--heading-color)",
};
