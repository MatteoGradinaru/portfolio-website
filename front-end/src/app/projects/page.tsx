"use client";

import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import NetworkExplorer from "@/components/ui/NetworkExplorer";
import WirelessExplorer from "@/components/ui/WirelessExplorer";
import FiretruckExplorer from "@/components/ui/FiretruckExplorer";

export default function Projects() {
  return (
    <section className="section">
      <h2 className="section-title">My Projects</h2>
      <p>
        Here are some of the projects I have worked on during my studies at UC
        Leuven Limburg.
      </p>

      <ProjectCard
        title="Advanced Enterprise Routing & MPLS Backbone"
        description="A hands-on project simulating a service provider network inside GNS3. I started by building an enterprise network using IS-IS routing, eBGP and iBGP internet peerings, and VRF-lite for customer isolation. Then, I set up an MPLS L3VPN backbone using LDP and MP-BGP to route customer traffic. To secure the connection, I configured a site-to-site IPsec tunnel with IKEv2 encryption directly between the customer edge routers, ensuring the service provider core cannot read the private data."
      >
        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#888" }}>
          Interact with the topology below for a better experience.
        </p>

        <NetworkExplorer />
      </ProjectCard>

      <ProjectCard
        title="Secure Enterprise Wireless LAN (WLAN) Infrastructure"
        description="This project was about building a secure, segmented wireless network on Proxmox. I set up a physical Cisco Access Point and configured a virtual Cisco Catalyst 9800-CL Wireless Controller (WLC). I split the network into three separate SSIDs (Corporate, Guest, IoT) mapped to different VLANs. To secure the networks, I set up an LXC container running FreeRADIUS for WPA3-Enterprise (802.1X) authentication, configured a local web portal (LWA) for guests, and defined firewall rules in OPNsense to keep guest and IoT traffic isolated from the corporate subnet."
      >
        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#888" }}>
          Interact with the topology below for a better experience.
        </p>

        <WirelessExplorer />
      </ProjectCard>

      <ProjectCard
        title="KU Leuven Event Registration & Attendance Management System"
        description="A full-stack web application built for KU Leuven to coordinate trial course registrations for prospective students. The project was developed in an agile team consisting of 3 seniors (who managed Scrum, Product Owner roles, DevOps, and CI/CD pipelines) and 3 juniors. As a junior developer, I focused on programming the Spring Boot Java backend and the Next.js frontend. The system features a chatbot-style student registration form, an administrative dashboard to control course visibility, and a browser-based QR code webcam scanner for real-time check-ins."
      />

      <ProjectCard
        title="Autonomous Smart Firetruck & Real-Time IoT Dashboard"
        description="An IoT and robotics project where our team of 5 students built an autonomous smart firetruck robot (using ESP32 microcontrollers, flame sensors, and a water tank/spray system) that autonomously navigates to and extinguishes fires. Working as the Integration Engineer alongside a Scrum Master, Product Owner, IoT Engineer, and Security Engineer, I connected the hardware sensors to the backend via WebSockets to stream live telemetry. I also managed the infrastructure by configuring automated CI/CD pipelines in GitHub Actions and deploying the services containerized on Kubernetes and OKD."
      >
        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#888" }}>
          Interact with the topology below for a better experience.
        </p>

        <FiretruckExplorer />
      </ProjectCard>
    </section>
  );
}
