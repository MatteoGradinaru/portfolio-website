export default function Contact() {
  return (
    <section className="section">
      <h2 className="section-title">Contact</h2>
      <p>Some text about the contact...</p>

      <div style={{ marginTop: "30px" }}>
        <p style={{ marginBottom: "10px" }}>
          <strong>Email:</strong>
          <br />
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
            style={{ textDecoration: "underline" }}
          >
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
          </a>
        </p>

        <p>
          <strong>LinkedIn:</strong><br />
          <a 
            href="https://www.linkedin.com/in/gradinaru-matteo" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            linkedin.com/in/gradinaru-matteo
          </a>
        </p>
      </div>
    </section>
  );
}
