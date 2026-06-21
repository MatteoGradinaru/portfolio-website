"use client";

import { ReactNode } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function ProjectCard({
  title,
  description,
  children,
}: ProjectCardProps) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h3>{title}</h3>
      <p style={{ marginTop: "10px" }}>{description}</p>
      {children}
    </div>
  );
}
