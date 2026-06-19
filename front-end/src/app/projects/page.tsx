"use client";

import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import NetworkExplorer from "@/components/ui/NetworkExplorer";
import WirelessExplorer from "@/components/ui/WirelessExplorer";

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
        description="A hands-on network infrastructure project focused on building scalable, secure enterprise and service provider networks using GNS3. In Labs 1-6, I implemented an enterprise architecture using IS-IS as the IGP, iBGP/eBGP for routing, and VRF-lite for tenant isolation. In Labs 7-9, I constructed an MPLS L3VPN provider backbone with MP-BGP, adding a site-to-site IPsec tunnel (using IKEv2) between customer routers to guarantee end-to-end traffic encryption across the public core."
      >
        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#888" }}>
          Interact with the topology explorer below: filter by protocol layers or click on a router to view active interfaces and global settings.
        </p>

        <NetworkExplorer />
      </ProjectCard>

      <ProjectCard
        title="Wireless Communication"
        description="A project centered on enterprise wireless LAN deployment, security, and RF site planning. Key areas included configuring Wireless LAN Controllers (WLCs) and lightweight access points, implementing secure WPA3-Enterprise authentication using 802.1X and RADIUS servers, performing channel mapping to reduce co-channel interference, and conducting signal propagation analysis."
      >
        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#888" }}>
          Interact with the wireless lab topology explorer below: filter by network layers or click on any host/VM node to view interfaces and configurations.
        </p>

        <WirelessExplorer />
      </ProjectCard>
    </section>
  );
}
