"use client";

import { useState, useEffect, useRef } from "react";

type WirelessFilter =
  | "ALL"
  | "INFRASTRUCTURE"
  | "VLANS"
  | "CAPWAP"
  | "802.1X"
  | "PORTAL";

interface WirelessDevice {
  id: string;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  filters: WirelessFilter[];
  interfaces: { name: string; ip: string; desc: string }[];
  config: string[];
  desc: string;
}

interface WirelessLink {
  id: string;
  from: string;
  to: string;
  fromCoords?: { x: number; y: number };
  toCoords?: { x: number; y: number };
  dashed?: boolean;
  curved?: boolean;
  color?: string;
  filters: WirelessFilter[];
  label?: string;
  pathData?: string;
}

// Coordinates map exactly to the nodes in wireless-topology-copy.drawio
const wirelessDevices: WirelessDevice[] = [
  {
    id: "client",
    name: "Client Device",
    x: 727,
    y: 20,
    width: 109,
    height: 109,
    color: "#a07cf8",
    filters: ["INFRASTRUCTURE", "VLANS", "802.1X", "PORTAL"],
    interfaces: [
      {
        name: "wlan0",
        ip: "DHCP Assigned",
        desc: "Wireless Interface connecting to AP",
      },
    ],
    config: [
      "Corporate SSID: WPA3-Enterprise (802.1X PEAP)",
      "Guest SSID: Captive Portal redirect (LWA)",
      "IoT SSID: WPA2-PSK Protected",
    ],
    desc: "Wireless client device (e.g. student laptop or phone) connecting to the segmented enterprise WLAN infrastructure.",
  },
  {
    id: "ap",
    name: "Cisco Access Point",
    x: 684,
    y: 203,
    width: 196,
    height: 54,
    color: "#00e5ff",
    filters: ["INFRASTRUCTURE", "VLANS", "CAPWAP", "802.1X", "PORTAL"],
    interfaces: [
      {
        name: "GigabitEthernet0",
        ip: "10.X.X.10 (DHCP)",
        desc: "Physical PoE port on Management VLAN (Native)",
      },
      {
        name: "Radio 2.4 / 5 GHz",
        ip: "SSIDs Broadcasted",
        desc: "Serves Corporate, Guest, and IoT wireless clients",
      },
    ],
    config: [
      "Mode: Lightweight CAPWAP Client",
      "Discovery: Option 43 hex TLV / DNS Override",
      "Primary Port: Access port on Management VLAN (Native)",
    ],
    desc: "Physical Cisco Catalyst Lightweight Access Point bridging wireless client radio frames to the virtual network core.",
  },
  {
    id: "switch",
    name: "Physical Managed Switch",
    x: 1303,
    y: 392,
    width: 242,
    height: 54,
    color: "#00b0ff",
    filters: ["INFRASTRUCTURE", "VLANS"],
    interfaces: [
      {
        name: "GigabitEthernet0/1",
        ip: "Trunk",
        desc: "Trunk link to Proxmox VE vmbr0 Bridge",
      },
      {
        name: "GigabitEthernet0/2",
        ip: "Access (VLAN XX)",
        desc: "Access port powering the physical AP",
      },
      {
        name: "GigabitEthernet0/24",
        ip: "Trunk (VLAN XX)",
        desc: "Trunk link to Cyberswitch instructor rack",
      },
    ],
    config: [
      "VLANs: Management (XX), Corporate (100), Guest (200), IoT (300)",
      "Gi0/1 Trunk allowed: XX,100,200,300 (Native: XX)",
      "Gi0/24 Trunk allowed: XX only (Isolated local traffic)",
    ],
    desc: "Physical managed rack switch distributing segmented VLANs to hypervisors, APs, and instructor gateways.",
  },
  {
    id: "cyberswitch",
    name: "Cyberswitch Gateway",
    x: 1294,
    y: 581,
    width: 260,
    height: 102,
    color: "#ffab40",
    filters: ["INFRASTRUCTURE"],
    interfaces: [
      {
        name: "WAN",
        ip: "Static Upstream",
        desc: "Primary internet gateway route",
      },
    ],
    config: [
      "Provides NAT and external internet access",
      "Acts as primary DHCP server for Student Switch native management",
    ],
    desc: "UCLL instructor laboratory gateway providing general internet access and student group network allocations.",
  },
  {
    id: "wlc",
    name: "Cisco 9800-CL WLC VM",
    x: 66,
    y: 556,
    width: 329,
    height: 391,
    color: "#2979ff",
    filters: ["INFRASTRUCTURE", "VLANS", "CAPWAP", "802.1X", "PORTAL"],
    interfaces: [
      {
        name: "GigabitEthernet1",
        ip: "10.X.X.2/24",
        desc: "Management Interface connected to vmbr1",
      },
      {
        name: "Vlan100 SVI",
        ip: "192.168.100.254/24",
        desc: "L2 termination for SSID Corporate",
      },
      {
        name: "Vlan200 SVI",
        ip: "192.168.200.254/24",
        desc: "L2 termination for SSID Guest",
      },
      {
        name: "Vlan300 SVI",
        ip: "192.168.30.254/24",
        desc: "L2 termination for SSID IoT",
      },
    ],
    config: [
      "SSID Corporate: VLAN 100, WPA3 Enterprise (802.1X)",
      "SSID Guest: VLAN 200, Webauth Local Web Portal redirect (LWA)",
      "SSID IoT: VLAN 300, WPA2-PSK",
      "RADIUS Server: 10.X.X.3 (Port 1812/1813 Auth/Acct)",
    ],
    desc: "Cisco Catalyst 9800-CL Virtual Wireless LAN Controller VM. Terminates client CAPWAP data packets and manages AP radio policies.",
  },
  {
    id: "radius",
    name: "FreeRADIUS LXC Container",
    x: 414,
    y: 733,
    width: 321,
    height: 500,
    color: "#1de9b6",
    filters: ["INFRASTRUCTURE", "802.1X", "PORTAL"],
    interfaces: [
      {
        name: "eth0",
        ip: "10.X.X.3/24",
        desc: "Virtual interface connected to vmbr1",
      },
    ],
    config: [
      "Protocols: EAP-PEAP with MSCHAPv2",
      "NAS Client: 10.X.X.2 (WLC) registered in clients.conf",
      "Sessions: guest profiles in users with Session-Timeout profile",
    ],
    desc: "FreeRADIUS server running in an isolated Linux Container (LXC). Processes 802.1X authentication and Captive Portal queries.",
  },
  {
    id: "opnsense",
    name: "OPNsense Firewall VM",
    x: 756,
    y: 733,
    width: 475,
    height: 500,
    color: "#ff1744",
    filters: ["INFRASTRUCTURE", "VLANS", "PORTAL"],
    interfaces: [
      {
        name: "vtnet0 (WAN)",
        ip: "DHCP Assigned",
        desc: "Connected to vmbr0 (outbound routing)",
      },
      {
        name: "vtnet1 (OPT1)",
        ip: "10.X.X.1/24",
        desc: "Management VLAN gateway",
      },
      {
        name: "vtnet1_vlan100",
        ip: "192.168.100.1/24",
        desc: "Corporate gateway SVI",
      },
      {
        name: "vtnet1_vlan200",
        ip: "192.168.200.1/24",
        desc: "Guest gateway SVI",
      },
      {
        name: "vtnet1_vlan300",
        ip: "192.168.30.1/24",
        desc: "IoT gateway SVI",
      },
    ],
    config: [
      "Services: DHCP scopes for VLANs XX, 100, 200, 300",
      "DHCP Option 43: Hex TLV string (f1:04:xx:xx:xx:xx)",
      "DNS Overrides: CISCO-CAPWAP-CONTROLLER -> 10.X.X.2",
      "Firewall: Inter-VLAN blocking & Captive Portal bypass rules",
    ],
    desc: "OPNsense virtual firewall and central router. Handles DHCP IP scopes, NAT internet routing, and security isolation policies.",
  },
];

// SVG Path rendering coordinates directly derived from the drawio file
const wirelessLinks: WirelessLink[] = [
  // Client to AP
  {
    id: "client-ap",
    from: "client",
    to: "ap",
    fromCoords: { x: 781.5, y: 129 },
    toCoords: { x: 782, y: 203 },
    color: "#a07cf8",
    filters: ["INFRASTRUCTURE", "VLANS", "802.1X", "PORTAL"],
    label: "Wi-Fi Airwaves",
    pathData: "M 781.5 129 L 782 203",
  },
  // AP to Switch
  {
    id: "ap-switch",
    from: "ap",
    to: "switch",
    fromCoords: { x: 880, y: 242 },
    toCoords: { x: 1424, y: 392 },
    curved: true,
    color: "#00b0ff",
    filters: ["INFRASTRUCTURE"],
    label: "Physical Cable (Management VLAN)",
    pathData: "M 880 242 Q 1424 242 1424 392",
  },
  // Switch to Cyberswitch
  {
    id: "switch-cyberswitch",
    from: "switch",
    to: "cyberswitch",
    fromCoords: { x: 1424, y: 446 },
    toCoords: { x: 1424, y: 581 },
    color: "#ffab40",
    filters: ["INFRASTRUCTURE"],
    label: "Outbound Internet",
    pathData: "M 1424 446 L 1424 581",
  },
  // Switch to vmbr0
  {
    id: "switch-vmbr0",
    from: "switch",
    to: "vmbr0",
    fromCoords: { x: 1320, y: 446 },
    toCoords: { x: 1081, y: 593 },
    curved: true,
    color: "#00b0ff",
    filters: ["INFRASTRUCTURE", "VLANS"],
    label: "Physical Trunk Cable",
    pathData: "M 1320 446 Q 1081 446 1081 593",
  },
  // vmbr0 to vtnet0 (OPNsense)
  {
    id: "vmbr0-vtnet0",
    from: "vmbr0",
    to: "vtnet0",
    fromCoords: { x: 1080.5, y: 671 },
    toCoords: { x: 1081, y: 813 },
    color: "#90a4ae",
    filters: ["INFRASTRUCTURE", "VLANS"],
    pathData: "M 1080.5 671 L 1081 813",
  },
  // vmbr1 to vtnet1 (OPNsense)
  {
    id: "vmbr1-vtnet1",
    from: "vmbr1",
    to: "vtnet1",
    fromCoords: { x: 741, y: 458 },
    toCoords: { x: 870, y: 813 },
    curved: true,
    color: "#90a4ae",
    filters: ["INFRASTRUCTURE"],
    pathData: "M 741 458 Q 870 458 870 813",
  },
  // vmbr1 to GigabitEthernet1 (WLC)
  {
    id: "vmbr1-ge1",
    from: "vmbr1",
    to: "ge1",
    fromCoords: { x: 518, y: 448 },
    toCoords: { x: 269, y: 605 },
    curved: true,
    color: "#90a4ae",
    filters: ["INFRASTRUCTURE", "CAPWAP"],
    pathData: "M 518 448 Q 269 448 269 605",
  },
  // vmbr1 to eth0 (FreeRADIUS)
  {
    id: "vmbr1-eth0",
    from: "vmbr1",
    to: "eth0",
    fromCoords: { x: 636.5, y: 458 },
    toCoords: { x: 635.5, y: 813 },
    color: "#90a4ae",
    filters: ["INFRASTRUCTURE", "802.1X"],
    pathData: "M 636.5 458 L 635.5 813",
  },
  // WLC Gi1 to Routing Engine (Internal)
  {
    id: "ge1-wlc_engine",
    from: "ge1",
    to: "wlc_engine",
    fromCoords: { x: 269, y: 659 },
    toCoords: { x: 207, y: 758 },
    curved: true,
    color: "#2979ff",
    filters: ["INFRASTRUCTURE", "CAPWAP"],
    pathData: "M 269 659 Q 269 733 207 758",
  },
  // FreeRADIUS eth0 to Engine (Internal)
  {
    id: "eth0-radius_engine",
    from: "eth0",
    to: "radius_engine",
    fromCoords: { x: 635.5, y: 867 },
    toCoords: { x: 595.5, y: 1046 },
    curved: true,
    color: "#1de9b6",
    filters: ["INFRASTRUCTURE", "802.1X"],
    pathData: "M 635.5 867 Q 636 997 595.5 1046",
  },
  // OPNsense vtnet0 to OPT1 Bridge
  {
    id: "vtnet0-opt1",
    from: "vtnet0",
    to: "opt1",
    fromCoords: { x: 1081, y: 867 },
    toCoords: { x: 889.5, y: 1073 },
    curved: true,
    color: "#ff1744",
    filters: ["INFRASTRUCTURE"],
    pathData:
      "M 1081 867 C 1081 900, 982 920, 982 997 C 982 1040, 940 1073, 890 1073",
  },
  // OPNsense vtnet1 to OPT1 Bridge
  {
    id: "vtnet1-opt1",
    from: "vtnet1",
    to: "opt1",
    fromCoords: { x: 870, y: 867 },
    toCoords: { x: 889.5, y: 1073 },
    curved: true,
    color: "#ff1744",
    filters: ["INFRASTRUCTURE"],
    pathData: "M 870 867 Q 870 997 890 1073",
  },
  // OPNsense vtnet0 to VLAN Gateways
  {
    id: "vtnet0-vlan_gateways",
    from: "vtnet0",
    to: "vlan_gateways",
    fromCoords: { x: 1081, y: 867 },
    toCoords: { x: 1107.5, y: 1096 },
    dashed: true,
    curved: true,
    color: "#ff1744",
    filters: ["INFRASTRUCTURE", "VLANS"],
    label: "VLAN Tags",
    pathData: "M 1081 867 Q 1108 948 1107.5 1096",
  },
  // CAPWAP virtual tunnel (AP to WLC Engine) - Exits left and goes around
  {
    id: "ap-wlc_engine",
    from: "ap",
    to: "wlc_engine",
    fromCoords: { x: 684, y: 230 },
    toCoords: { x: 125, y: 840 },
    dashed: true,
    curved: true,
    color: "#00e5ff",
    filters: ["CAPWAP"],
    label: "CAPWAP Tunnel",
    pathData:
      "M 684 230 C 400 230, 144 250, 144 306 L 144 733 C 144 800, 100 840, 125 840",
  },
  // WLC to RADIUS authentication link
  {
    id: "wlc_engine-radius_engine",
    from: "wlc_engine",
    to: "radius_engine",
    fromCoords: { x: 207, y: 922 },
    toCoords: { x: 514, y: 1127.5 },
    dashed: true,
    curved: true,
    color: "#1de9b6",
    filters: ["802.1X", "PORTAL"],
    label: "RADIUS Request/Accept (UDP 1812/1813)",
    pathData: "M 207 922 L 207 948 Q 207 997 514 1127.5",
  },
];

export default function WirelessExplorer() {
  const [activeFilter, setActiveFilter] = useState<WirelessFilter>("ALL");
  const [selectedDevice, setSelectedDevice] = useState<WirelessDevice | null>(
    null,
  );

  const getLinkLabelCoords = (id: string) => {
    switch (id) {
      case "client-ap":
        return { x: 795, y: 166 };
      case "ap-switch":
        return { x: 1040, y: 220 };
      case "switch-cyberswitch":
        return { x: 1440, y: 513 };
      case "switch-vmbr0":
        return { x: 1200, y: 425 };
      case "vtnet0-vlan_gateways":
        return { x: 1120, y: 980 };
      case "ap-wlc_engine":
        return { x: 130, y: 400 };
      case "wlc_engine-radius_engine":
        return { x: 260, y: 1020 };
      default:
        return { x: 1330, y: 500 };
    }
  };

  // Zoom & Pan State
  const [scale, setScale] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [svgEl, setSvgEl] = useState<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgEl) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomFactor = 0.05;
        if (e.deltaY < 0) {
          setScale((prev) => Math.min(prev + zoomFactor, 2.5));
        } else {
          setScale((prev) => Math.max(prev - zoomFactor, 0.3));
        }
      }
    };

    svgEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      svgEl.removeEventListener("wheel", handleWheel);
    };
  }, [svgEl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const getOpacity = (type: "device" | "link" | "other", id: string) => {
    if (activeFilter === "ALL") return 1;
    if (type === "device") {
      const dev = wirelessDevices.find((d) => d.id === id);
      return dev?.filters.includes(activeFilter) ? 1 : 0.15;
    }
    if (type === "link") {
      const lnk = wirelessLinks.find((l) => l.id === id);
      return lnk?.filters.includes(activeFilter) ? 1 : 0.08;
    }
    if (type === "other") {
      const otherFilters: Record<string, WirelessFilter[]> = {
        vmbr0: ["INFRASTRUCTURE", "VLANS"],
        vmbr1: ["INFRASTRUCTURE", "CAPWAP", "802.1X", "PORTAL"],
        vtnet0: ["INFRASTRUCTURE", "VLANS"],
        vtnet1: ["INFRASTRUCTURE", "VLANS", "PORTAL"],
        opt1: ["INFRASTRUCTURE", "VLANS", "PORTAL"],
        vlan_gateways: ["INFRASTRUCTURE", "VLANS"],
        ge1: ["INFRASTRUCTURE", "CAPWAP"],
        wlc_engine: ["INFRASTRUCTURE", "CAPWAP", "802.1X", "PORTAL"],
        eth0: ["INFRASTRUCTURE", "802.1X"],
        radius_engine: ["INFRASTRUCTURE", "802.1X", "PORTAL"],
      };
      const filters = otherFilters[id] || ["INFRASTRUCTURE"];
      return filters.includes(activeFilter) ? 1 : 0.12;
    }
    return 1;
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragged(false);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setDragged(true);
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2.5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.3));
  const resetZoom = () => {
    setScale(0.85);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        marginTop: isFullscreen ? "0px" : "15px",
        border: isFullscreen ? "none" : "1px solid #2d3139",
        borderRadius: isFullscreen ? "0px" : "12px",
        overflow: "hidden",
        backgroundColor: "#070a0e",
        color: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, system-ui, sans-serif",
        ...(isFullscreen
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
            }
          : {}),
      }}
    >
      {/* Top Header Panel to match NetworkExplorer layout */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #333",
          backgroundColor: "#161b22",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            fontSize: "0.9rem",
            paddingLeft: "20px",
            color: "#fff",
          }}
        >
          Wireless Infrastructure Topology
        </span>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            padding: "12px 20px",
            border: "none",
            backgroundColor: "#1f242c",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderLeft: "1px solid #333",
            alignSelf: "stretch",
          }}
        >
          {isFullscreen ? "Exit Fullscreen ✕" : "Fullscreen ⛶"}
        </button>
      </div>

      {/* Content wrapper with padding to match Firetruck layout */}
      <div
        style={{
          padding: "20px",
          ...(isFullscreen
            ? {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }
            : {}),
        }}
      >
        {/* Filter Pills center-aligned underneath description paragraph */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { id: "ALL", label: "All Layers" },
            { id: "INFRASTRUCTURE", label: "Infrastructure" },
            { id: "VLANS", label: "VLANs & Trunks" },
            { id: "CAPWAP", label: "CAPWAP Tunnels" },
            { id: "802.1X", label: "802.1X Auth" },
            { id: "PORTAL", label: "Guest Captive Portal" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                setActiveFilter(btn.id as WirelessFilter);
                setSelectedDevice(null);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid #333",
                backgroundColor:
                  activeFilter === btn.id ? "#2979ff" : "#161b22",
                color: activeFilter === btn.id ? "#fff" : "#ccc",
                cursor: "pointer",
                fontSize: "0.8rem",
                transition: "all 0.2s",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* SVG Diagram Canvas */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: isFullscreen ? "calc(100vh - 350px)" : "680px",
            backgroundColor: "#070a0e",
            borderRadius: "8px",
            border: "1px solid #333",
            overflow: "hidden",
            ...(isFullscreen ? { flex: 1, minHeight: "250px" } : {}),
          }}
        >
          {/* Control panel buttons bottom right */}
          <div
            style={{
              position: "absolute",
              right: "20px",
              bottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              zIndex: 10,
            }}
          >
            <button
              onClick={zoomIn}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "1px solid #30363d",
                backgroundColor: "#161b22",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              +
            </button>
            <button
              onClick={zoomOut}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "1px solid #30363d",
                backgroundColor: "#161b22",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              -
            </button>
            <button
              onClick={resetZoom}
              style={{
                width: "45px",
                height: "26px",
                borderRadius: "4px",
                border: "1px solid #30363d",
                backgroundColor: "#161b22",
                color: "#c9d1d9",
                cursor: "pointer",
                fontSize: "9px",
                fontWeight: "bold",
              }}
            >
              Reset
            </button>
          </div>

          <svg
            ref={setSvgEl}
            width="100%"
            height="100%"
            viewBox="0 0 1600 1300"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background grid dots for diagram blueprint look */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="#161b22" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
              style={{
                transformOrigin: "800px 650px",
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
            >
              {/* Proxmox Host Enclosure */}
              <rect
                x="20"
                y="355"
                width="1239"
                height="903"
                rx="12"
                fill="none"
                stroke="#888"
                strokeWidth="2.5"
                strokeDasharray="6,6"
                style={{
                  opacity: getOpacity("other", "vmbr0") === 1 ? 0.45 : 0.15,
                  transition: "opacity 0.3s",
                }}
              />
              <text
                x="639.5"
                y="376"
                fill="#e2e8f0"
                textAnchor="middle"
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  opacity: getOpacity("other", "vmbr0") === 1 ? 0.9 : 0.25,
                  transition: "opacity 0.3s",
                }}
              >
                PROXMOX VE HYPERVISOR (HOST MACHINE)
              </text>

              {/* vmbr1 Bridge inside Proxmox */}
              <g
                style={{
                  opacity: getOpacity("other", "vmbr1"),
                  transition: "opacity 0.3s",
                }}
              >
                <rect
                  x="518"
                  y="380"
                  width="237"
                  height="78"
                  rx="6"
                  fill="#0d1117"
                  stroke="#8b949e"
                  strokeWidth="2"
                />
                <text
                  x="636.5"
                  y="422"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                >
                  vmbr1 Bridge
                </text>
              </g>

              {/* vmbr0 Bridge inside Proxmox */}
              <g
                style={{
                  opacity: getOpacity("other", "vmbr0"),
                  transition: "opacity 0.3s",
                }}
              >
                <rect
                  x="955"
                  y="593"
                  width="251"
                  height="78"
                  rx="6"
                  fill="#0d1117"
                  stroke="#8b949e"
                  strokeWidth="2"
                />
                <text
                  x="1080.5"
                  y="635"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                >
                  vmbr0 Bridge
                </text>
              </g>

              {/* Main Enclosures / VM Container Boxes */}
              {/* WLC VM Box */}
              <g style={{ opacity: getOpacity("device", "wlc"), transition: "opacity 0.3s" }}>
                <rect
                  x="66"
                  y="556"
                  width="329"
                  height="391"
                  rx="8"
                  fill="#0d1117"
                  stroke="#2979ff"
                  strokeWidth="2.5"
                />
                <text
                  x="230.5"
                  y="585"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="13"
                  fontWeight="bold"
                >
                  Cisco 9800-CL WLC VM
                </text>

                {/* GigabitEthernet1 inside WLC */}
                <g style={{ opacity: getOpacity("other", "ge1"), transition: "opacity 0.3s" }}>
                  <rect
                    x="179"
                    y="605"
                    width="180"
                    height="54"
                    rx="4"
                    fill="#161b22"
                    stroke="#2979ff"
                    strokeWidth="1.5"
                  />
                  <text
                    x="269"
                    y="637"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="10.5"
                    fontWeight="bold"
                  >
                    GigabitEthernet1
                  </text>
                </g>

                {/* WLC Routing Engine inside WLC */}
                <g style={{ opacity: getOpacity("other", "wlc_engine"), transition: "opacity 0.3s" }}>
                  <circle
                    cx="207"
                    cy="840"
                    r="70"
                    fill="#161b22"
                    stroke="#2979ff"
                    strokeWidth="1.5"
                  />
                  <text
                    x="207"
                    y="844"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    WLC Routing
                  </text>
                </g>
              </g>

              {/* FreeRADIUS LXC Container Box */}
              <g style={{ opacity: getOpacity("device", "radius"), transition: "opacity 0.3s" }}>
                <rect
                  x="414"
                  y="733"
                  width="321"
                  height="500"
                  rx="8"
                  fill="#0d1117"
                  stroke="#1de9b6"
                  strokeWidth="2.5"
                />
                <text
                  x="574.5"
                  y="762"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="13"
                  fontWeight="bold"
                >
                  FreeRADIUS LXC
                </text>

                {/* eth0 inside FreeRADIUS */}
                <g style={{ opacity: getOpacity("other", "eth0"), transition: "opacity 0.3s" }}>
                  <rect
                    x="590"
                    y="813"
                    width="91"
                    height="54"
                    rx="4"
                    fill="#161b22"
                    stroke="#1de9b6"
                    strokeWidth="1.5"
                  />
                  <text
                    x="635.5"
                    y="845"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="10.5"
                    fontWeight="bold"
                  >
                    eth0
                  </text>
                </g>

                {/* FreeRADIUS Engine inside FreeRADIUS */}
                <g style={{ opacity: getOpacity("other", "radius_engine"), transition: "opacity 0.3s" }}>
                  <circle
                    cx="595.5"
                    cy="1127.5"
                    r="70"
                    fill="#161b22"
                    stroke="#1de9b6"
                    strokeWidth="1.5"
                  />
                  <text
                    x="595.5"
                    y="1131.5"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    FreeRADIUS
                  </text>
                </g>
              </g>

              {/* OPNsense VM Box */}
              <g style={{ opacity: getOpacity("device", "opnsense"), transition: "opacity 0.3s" }}>
                <rect
                  x="756"
                  y="733"
                  width="475"
                  height="500"
                  rx="8"
                  fill="#0d1117"
                  stroke="#ff1744"
                  strokeWidth="2.5"
                />
                <text
                  x="993.5"
                  y="762"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="13"
                  fontWeight="bold"
                >
                  OPNsense VM
                </text>

                {/* vtnet0 inside OPNsense */}
                <g style={{ opacity: getOpacity("other", "vtnet0"), transition: "opacity 0.3s" }}>
                  <rect
                    x="1002"
                    y="813"
                    width="158"
                    height="54"
                    rx="4"
                    fill="#161b22"
                    stroke="#ff1744"
                    strokeWidth="1.5"
                  />
                  <text
                    x="1081"
                    y="845"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="10.5"
                    fontWeight="bold"
                  >
                    vtnet0 / NIC 1
                  </text>
                </g>

                {/* vtnet1 inside OPNsense */}
                <g style={{ opacity: getOpacity("other", "vtnet1"), transition: "opacity 0.3s" }}>
                  <rect
                    x="791"
                    y="813"
                    width="158"
                    height="54"
                    rx="4"
                    fill="#161b22"
                    stroke="#ff1744"
                    strokeWidth="1.5"
                  />
                  <text
                    x="870"
                    y="845"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="10.5"
                    fontWeight="bold"
                  >
                    vtnet1 / NIC 2
                  </text>
                </g>

                {/* OPT1 Bridge inside OPNsense */}
                <g style={{ opacity: getOpacity("other", "opt1"), transition: "opacity 0.3s" }}>
                  <circle
                    cx="889.5"
                    cy="1126.5"
                    r="48"
                    fill="#161b22"
                    stroke="#ff1744"
                    strokeWidth="1.5"
                  />
                  <text
                    x="889.5"
                    y="1130"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    OPT1 Bridge
                  </text>
                </g>

                {/* VLAN Subnet Gateways inside OPNsense */}
                <g style={{ opacity: getOpacity("other", "vlan_gateways"), transition: "opacity 0.3s" }}>
                  <rect
                    x="1020"
                    y="1096"
                    width="175"
                    height="63"
                    rx="4"
                    fill="#161b22"
                    stroke="#ff1744"
                    strokeWidth="1.5"
                  />
                  <text
                    x="1107.5"
                    y="1131"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    VLAN 100, 200, 300
                  </text>
                </g>
              </g>

              {/* Connections (Lines / Paths) */}
              {wirelessLinks.map((link) => {
                const opacity = getOpacity("link", link.id);
                const active = opacity === 1;

                return (
                  <g
                    key={link.id}
                    style={{
                      opacity: opacity,
                      transition: "opacity 0.3s",
                    }}
                  >
                    <path
                      d={link.pathData}
                      stroke={link.color || "#fff"}
                      strokeWidth={active ? "3.5" : "2"}
                      fill="none"
                      strokeDasharray={link.dashed ? "6,6" : "none"}
                    />
                    {link.label && active && (
                      <text
                        x={getLinkLabelCoords(link.id).x}
                        y={getLinkLabelCoords(link.id).y}
                        fill={link.color || "#fff"}
                        textAnchor={
                          link.id === "client-ap" ||
                          link.id === "switch-cyberswitch" ||
                          link.id === "vtnet0-vlan_gateways"
                            ? "start"
                            : link.id === "ap-wlc_engine" ||
                                link.id === "wlc_engine-radius_engine"
                              ? "end"
                              : "middle"
                        }
                        style={{ fontSize: "15px", fontWeight: "bold" }}
                      >
                        {link.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Devices clickable interactive layers */}
              {/* Client Device Node */}
              <g
                onClick={() => setSelectedDevice(wirelessDevices[0])}
                style={{
                  cursor: "pointer",
                  opacity: getOpacity("device", "client"),
                  transition: "opacity 0.3s",
                }}
                className="interactive-node"
              >
                <circle
                  cx="781.5"
                  cy="74.5"
                  r="54.5"
                  fill="#0d1117"
                  stroke={selectedDevice?.id === "client" ? "#fff" : "#a07cf8"}
                  strokeWidth={selectedDevice?.id === "client" ? 3.5 : 2.5}
                />
                <text
                  x="781.5"
                  y="78.5"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11.5"
                  fontWeight="bold"
                >
                  Client Device
                </text>
              </g>

              {/* Cisco Access Point Node */}
              <g
                onClick={() => setSelectedDevice(wirelessDevices[1])}
                style={{
                  cursor: "pointer",
                  opacity: getOpacity("device", "ap"),
                  transition: "opacity 0.3s",
                }}
                className="interactive-node"
              >
                <rect
                  x="684"
                  y="203"
                  width="196"
                  height="54"
                  rx="6"
                  fill="#0d1117"
                  stroke={selectedDevice?.id === "ap" ? "#fff" : "#00e5ff"}
                  strokeWidth={selectedDevice?.id === "ap" ? 3.5 : 2.5}
                />
                <text
                  x="782"
                  y="234.5"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Cisco AP
                </text>
              </g>

              {/* Physical Switch Node */}
              <g
                onClick={() => setSelectedDevice(wirelessDevices[2])}
                style={{
                  cursor: "pointer",
                  opacity: getOpacity("device", "switch"),
                  transition: "opacity 0.3s",
                }}
                className="interactive-node"
              >
                <rect
                  x="1303"
                  y="392"
                  width="242"
                  height="54"
                  rx="6"
                  fill="#0d1117"
                  stroke={selectedDevice?.id === "switch" ? "#fff" : "#00b0ff"}
                  strokeWidth={selectedDevice?.id === "switch" ? 3.5 : 2.5}
                />
                <text
                  x="1424"
                  y="423.5"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Managed Switch
                </text>
              </g>

              {/* Cyberswitch Node */}
              <g
                onClick={() => setSelectedDevice(wirelessDevices[3])}
                style={{
                  cursor: "pointer",
                  opacity: getOpacity("device", "cyberswitch"),
                  transition: "opacity 0.3s",
                }}
                className="interactive-node"
              >
                <rect
                  x="1294"
                  y="581"
                  width="260"
                  height="102"
                  rx="6"
                  fill="#0d1117"
                  stroke={
                    selectedDevice?.id === "cyberswitch" ? "#fff" : "#ffab40"
                  }
                  strokeWidth={selectedDevice?.id === "cyberswitch" ? 3.5 : 2.5}
                />
                <text
                  x="1424"
                  y="622"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12.5"
                  fontWeight="bold"
                >
                  Cyberswitch
                </text>
                <text
                  x="1424"
                  y="642"
                  textAnchor="middle"
                  fill="#8b949e"
                  fontSize="10"
                >
                  Instructor Gateway / Internet
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Details Panel below SVG Map - styled to match Firetruck topology */}
        <div
          style={{
            marginTop: "15px",
            minHeight: "140px",
            padding: "16px",
            backgroundColor: "#161b22",
            borderRadius: "8px",
            border: "1px solid #333",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            ...(isFullscreen
              ? {
                  maxHeight: "200px",
                  overflowY: "auto",
                }
              : {}),
          }}
        >
          {selectedDevice ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: 0,
                    color: selectedDevice.color,
                    fontSize: "1.05rem",
                    fontWeight: "bold",
                  }}
                >
                  {selectedDevice.name} Details
                </h4>
                <div
                  style={{ display: "flex", gap: "5px", marginTop: "6px", flexWrap: "wrap" }}
                >
                  {selectedDevice.filters.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: "0.6rem",
                        padding: "2px 6px",
                        backgroundColor: "#333",
                        borderRadius: "10px",
                        color: "#888",
                        fontWeight: "bold",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: "#ccc",
                    fontSize: "0.85rem",
                    lineHeight: "1.5",
                  }}
                >
                  {selectedDevice.desc}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "30px",
                  marginTop: "4px",
                }}
              >
                <div style={{ flex: "1 1 300px" }}>
                  <h5
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "0.75rem",
                      color: "#8b949e",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Interfaces & IPs
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {selectedDevice.interfaces.map((inf, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: "#161b22",
                          border: "1px solid #21262d",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: "bold",
                            marginBottom: "2px",
                          }}
                        >
                          <span style={{ color: "#fff" }}>{inf.name}</span>
                          <span style={{ color: selectedDevice.color }}>
                            {inf.ip}
                          </span>
                        </div>
                        <div style={{ color: "#8b949e", fontSize: "0.75rem" }}>
                          {inf.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ flex: "2 1 400px" }}>
                  <h5
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "0.75rem",
                      color: "#8b949e",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Parameters & Configurations
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {selectedDevice.config.map((conf, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 12px",
                          borderLeft: `3px solid ${selectedDevice.color}`,
                          backgroundColor: "#161b22",
                          borderRadius: "0 4px 4px 0",
                          fontSize: "0.8rem",
                          color: "#c9d1d9",
                        }}
                      >
                        {conf}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100px",
                color: "#666",
                fontSize: "0.9rem",
              }}
            >
              Click on any component in the topology map above to inspect its
              interface parameters, subnets, and active configurations.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .interactive-node:hover rect,
        .interactive-node:hover circle {
          filter: brightness(1.3);
        }
        .pulse-path {
          animation: dash 35s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
