"use client";

import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import NetworkExplorer from "@/components/ui/NetworkExplorer";

export default function Projects() {
  return (
    <section className="section">
      <h2 className="section-title">My Projects</h2>
      <p>
        Here are some of the projects I have worked on during my studies at UC
        Leuven Limburg, focusing on IT-Infrastructure.
      </p>

      <ProjectCard
        title="Advanced Networking & Security"
        description="Description I need to add..."
      >
        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#666" }}>
          Explaining how the tpology works
        </p>

        <NetworkExplorer />
      </ProjectCard>

      <ProjectCard
        title="Wireless Communication"
        description="Description coming soon..."
      />
    </section>
  );
}
