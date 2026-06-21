export type Protocol =
  | "ALL"
  | "IS-IS"
  | "eBGP"
  | "iBGP"
  | "MPLS/LDP"
  | "VPNv4"
  | "VRF"
  | "IPsec";

export interface DeviceInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  color?: string;
  protocols: Protocol[];
  interfaces: { name: string; ip: string; desc: string }[];
  config: string[];
}

export interface Connection {
  from: string;
  to: string;
  dashed?: boolean;
  color?: string;
  curved?: boolean;
  curveOffset?: number;
  protocols: Protocol[];
}

export interface TopologyData {
  title: string;
  availableProtocols: Protocol[];
  devices: DeviceInfo[];
  connections: Connection[];
}

export const lab1to6Data: TopologyData = {
  title: "Lab 1-6: Enterprise & ISP Infrastructure",
  availableProtocols: ["ALL", "IS-IS", "eBGP", "iBGP", "VRF"],
  devices: [
    {
      id: "ispa",
      name: "ISP-A",
      x: 300,
      y: 50,
      color: "#ffab40",
      protocols: ["eBGP"],
      interfaces: [
        { name: "Loopback0", ip: "8.8.8.1/32", desc: "Internet Simulator" },
        { name: "Gi0/0", ip: "198.51.100.1/30", desc: "WAN to EDGE-R1" },
      ],
      config: ["ASN: 65001", "BGP: Advertising 0.0.0.0/0"],
    },
    {
      id: "ispb",
      name: "ISP-B",
      x: 600,
      y: 50,
      color: "#ffab40",
      protocols: ["eBGP"],
      interfaces: [
        { name: "Loopback0", ip: "9.9.9.1/32", desc: "Internet Simulator" },
        { name: "Gi0/0", ip: "198.51.200.1/30", desc: "WAN to EDGE-R2" },
      ],
      config: ["ASN: 65002", "BGP: Backup Upstream"],
    },
    {
      id: "edge1",
      name: "EDGE-R1",
      x: 300,
      y: 150,
      color: "#00e5ff",
      protocols: ["IS-IS", "eBGP", "iBGP"],
      interfaces: [
        { name: "Loopback0", ip: "10.255.0.1/32", desc: "Router ID" },
        { name: "Gi0/0", ip: "198.51.100.2/30", desc: "WAN to ISP-A" },
      ],
      config: ["ASN: 65100", "Local Pref: 200 (Primary)"],
    },
    {
      id: "edge2",
      name: "EDGE-R2",
      x: 600,
      y: 150,
      color: "#00e5ff",
      protocols: ["IS-IS", "eBGP", "iBGP"],
      interfaces: [
        { name: "Loopback0", ip: "10.255.255.2/32", desc: "Router ID" },
        { name: "Gi0/0", ip: "198.51.200.2/30", desc: "WAN to ISP-B" },
      ],
      config: ["ASN: 65100", "Local Pref: 100"],
    },
    {
      id: "core1",
      name: "CORE-R1",
      x: 250,
      y: 280,
      color: "#00b0ff",
      protocols: ["IS-IS", "iBGP", "VRF"],
      interfaces: [
        { name: "Loopback0", ip: "10.255.0.2/32", desc: "Router ID" },
        { name: "Gi0/3", ip: "192.168.100.1/30", desc: "VRF CLIENT-A" },
      ],
      config: ["IS-IS L1/L2", "VRF-Lite Config"],
    },
    {
      id: "core2",
      name: "CORE-R2",
      x: 650,
      y: 280,
      color: "#00b0ff",
      protocols: ["IS-IS", "iBGP"],
      interfaces: [
        { name: "Loopback0", ip: "10.255.0.5/32", desc: "Router ID" },
      ],
      config: ["IS-IS L1/L2", "iBGP Peer"],
    },
    {
      id: "dist1",
      name: "DIST-R1",
      x: 550,
      y: 400,
      color: "#1de9b6",
      protocols: ["IS-IS"],
      interfaces: [
        { name: "Loopback0", ip: "10.255.0.3/32", desc: "Router ID" },
      ],
      config: ["IS-IS L1-Only"],
    },
    {
      id: "dist2",
      name: "DIST-R2",
      x: 750,
      y: 400,
      color: "#1de9b6",
      protocols: ["IS-IS"],
      interfaces: [
        { name: "Loopback0", ip: "10.255.0.4/32", desc: "Router ID" },
      ],
      config: ["IS-IS L1-Only"],
    },
    {
      id: "routera",
      name: "Router-A",
      x: 150,
      y: 400,
      color: "#a07cf8",
      protocols: ["VRF"],
      interfaces: [
        { name: "Gi0/0", ip: "192.168.100.2/30", desc: "WAN to CORE-R1" },
      ],
      config: ["VRF Client A"],
    },
    {
      id: "routerb",
      name: "Router-B",
      x: 350,
      y: 400,
      color: "#a07cf8",
      protocols: ["VRF"],
      interfaces: [
        { name: "Gi0/0", ip: "192.168.200.2/30", desc: "WAN to CORE-R1" },
      ],
      config: ["VRF Client B"],
    },
  ],
  connections: [
    { from: "ispa", to: "edge1", color: "#ffab40", protocols: ["eBGP"] },
    { from: "ispb", to: "edge2", color: "#ffab40", protocols: ["eBGP"] },
    {
      from: "edge1",
      to: "edge2",
      dashed: true,
      color: "#999",
      protocols: ["iBGP"],
    },
    { from: "edge1", to: "core1", protocols: ["IS-IS", "iBGP"] },
    { from: "edge1", to: "core2", protocols: ["IS-IS", "iBGP"] },
    { from: "edge2", to: "core1", protocols: ["IS-IS", "iBGP"] },
    { from: "edge2", to: "core2", protocols: ["IS-IS", "iBGP"] },
    { from: "core1", to: "core2", color: "#00e5ff", protocols: ["IS-IS"] },
    {
      from: "core1",
      to: "routera",
      dashed: true,
      color: "#a07cf8",
      protocols: ["VRF"],
    },
    {
      from: "core1",
      to: "routerb",
      dashed: true,
      color: "#a07cf8",
      protocols: ["VRF"],
    },
    { from: "core1", to: "dist1", protocols: ["IS-IS"] },
    { from: "core2", to: "dist2", protocols: ["IS-IS"] },
  ],
};

export const lab7to9Data: TopologyData = {
  title: "Lab 7-9: MPLS Service Provider Backbone",
  availableProtocols: ["ALL", "IS-IS", "MPLS/LDP", "VPNv4", "VRF", "IPsec"],
  devices: [
    {
      id: "ce1a",
      name: "CE1-A",
      x: 100,
      y: 250,
      color: "#a07cf8",
      protocols: ["VRF", "IPsec"],
      interfaces: [
        {
          name: "Loopback0",
          ip: "172.16.1.1/32",
          desc: "IPsec Tunnel Endpoint",
        },
        {
          name: "Gi0/0",
          ip: "192.168.1.2/30",
          desc: "Link to PE1 (VRF Client A)",
        },
        { name: "Gi0/1", ip: "10.1.0.1/24", desc: "LAN Site 1" },
        {
          name: "Tunnel0",
          ip: "10.99.0.1/30",
          desc: "IPsec over L3VPN Tunnel",
        },
      ],
      config: [
        "Customer Edge",
        "IPsec Tunnel (IKEv2)",
        "Pre-Shared Key authentication",
      ],
    },
    {
      id: "pe1",
      name: "PE1",
      x: 300,
      y: 250,
      color: "#00e5ff",
      protocols: ["IS-IS", "MPLS/LDP", "VPNv4", "VRF"],
      interfaces: [
        { name: "Loopback0", ip: "10.255.0.1/32", desc: "LDP Router ID" },
        { name: "Gi0/0", ip: "10.0.0.1/30", desc: "MPLS Interface to P1" },
        { name: "Gi0/1", ip: "192.168.1.1/30", desc: "VRF Interface to CE1-A" },
      ],
      config: [
        "Provider Edge",
        "MPLS/LDP enabled",
        "MP-BGP VPNv4 Peer",
        "VRF: CLIENT-A (RD 65100:100, RT 65100:100)",
      ],
    },
    {
      id: "p1",
      name: "P1",
      x: 500,
      y: 250,
      color: "#00b0ff",
      protocols: ["IS-IS", "MPLS/LDP"],
      interfaces: [
        { name: "Loopback0", ip: "10.255.0.2/32", desc: "LSR Router ID" },
        { name: "Gi0/0", ip: "10.0.0.2/30", desc: "MPLS to PE1" },
        { name: "Gi0/1", ip: "10.0.0.5/30", desc: "MPLS to PE2" },
      ],
      config: [
        "Provider Core (LSR)",
        "IS-IS L2 IGP routing",
        "MPLS Label Switching",
      ],
    },
    {
      id: "pe2",
      name: "PE2",
      x: 700,
      y: 250,
      color: "#00e5ff",
      protocols: ["IS-IS", "MPLS/LDP", "VPNv4", "VRF"],
      interfaces: [
        { name: "Loopback0", ip: "10.255.0.3/32", desc: "LDP Router ID" },
        { name: "Gi0/0", ip: "10.0.0.6/30", desc: "MPLS Interface to P1" },
        { name: "Gi0/1", ip: "192.168.2.1/30", desc: "VRF Interface to CE2-A" },
      ],
      config: [
        "Provider Edge",
        "MPLS/LDP enabled",
        "MP-BGP VPNv4 Peer",
        "VRF: CLIENT-A (RD 65100:100, RT 65100:100)",
      ],
    },
    {
      id: "ce2a",
      name: "CE2-A",
      x: 900,
      y: 250,
      color: "#a07cf8",
      protocols: ["VRF", "IPsec"],
      interfaces: [
        {
          name: "Loopback0",
          ip: "172.16.2.1/32",
          desc: "IPsec Tunnel Endpoint",
        },
        {
          name: "Gi0/0",
          ip: "192.168.2.2/30",
          desc: "Link to PE2 (VRF Client A)",
        },
        { name: "Gi0/1", ip: "10.2.0.1/24", desc: "LAN Site 2" },
        {
          name: "Tunnel0",
          ip: "10.99.0.2/30",
          desc: "IPsec over L3VPN Tunnel",
        },
      ],
      config: [
        "Customer Edge",
        "IPsec Tunnel (IKEv2)",
        "Pre-Shared Key authentication",
      ],
    },
  ],
  connections: [
    { from: "ce1a", to: "pe1", protocols: ["VRF"] },
    { from: "pe1", to: "p1", protocols: ["IS-IS", "MPLS/LDP"] },
    { from: "p1", to: "pe2", protocols: ["IS-IS", "MPLS/LDP"] },
    { from: "pe2", to: "ce2a", protocols: ["VRF"] },
    {
      from: "pe1",
      to: "pe2",
      dashed: true,
      color: "#00e5ff",
      curved: true,
      protocols: ["VPNv4"],
    },
    {
      from: "ce1a",
      to: "ce2a",
      dashed: true,
      color: "#ff1744",
      curved: true,
      curveOffset: 160,
      protocols: ["IPsec"],
    },
  ],
};
