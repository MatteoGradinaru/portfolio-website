"use client";

export default function Home() {
  return (
    <section className="hero">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <h1 className="hero-title">Hello, I'm Matteo</h1>
          <p className="hero-subtitle">
            Final-year Applied Computer Science student at UC Leuven Limburg.
          </p>
          <p
            style={{
              fontSize: "1.15rem",
              lineHeight: "1.7",
              color: "var(--text-main)",
            }}
          >
            I specialize in IT-Infrastructure with a strong interest in Advanced
            Networking & Security, Wireless Communication, Cloud and
            Infrastructure. I enjoy building secure, scalable networks web-apps,
            configuring servers and exploring the technical depths of
            communication systems.
          </p>
        </div>

        {/* Protected Profile Image */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="/profile.jpeg"
            alt="Matteo"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              objectFit: "cover",
              userSelect: "none",
              WebkitUserSelect: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
