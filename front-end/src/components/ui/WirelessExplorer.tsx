"use client";

import { useState } from "react";
import { useSvgPanZoom } from "@/lib/hooks/useSvgPanZoom";
import {
  wirelessDevices,
  wirelessLinks,
  getLinkLabelCoords,
  WirelessFilter,
  WirelessDevice,
} from "@/lib/data/wirelessTopology";

export default function WirelessExplorer() {
  const [activeFilter, setActiveFilter] = useState<WirelessFilter>("ALL");
  const [selectedDevice, setSelectedDevice] = useState<WirelessDevice | null>(
    null,
  );

  const {
    scale,
    pan,
    isDragging,
    isFullscreen,
    setIsFullscreen,
    svgRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useSvgPanZoom({ minScale: 0.3, maxScale: 2.5, zoomFactor: 0.05 });

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

  return (
    <div
      style={{
        marginTop: isFullscreen ? "0px" : "15px",
        border: isFullscreen ? "none" : "1px solid #333",
        borderRadius: isFullscreen ? "0px" : "12px",
        overflow: "hidden",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-main)",
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
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              backgroundColor: "var(--card-bg)",
            }
          : {}),
      }}
    >
      {/* Top Header Panel */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #333",
          backgroundColor: "var(--card-bg)",
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
            color: "var(--text-main)",
          }}
        >
          Wireless Infrastructure Topology
        </span>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            padding: "12px 20px",
            border: "none",
            backgroundColor: "var(--card-bg)",
            color: "var(--text-main)",
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

      {/* Content wrapper */}
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
        {/* Filter Pills */}
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
                  activeFilter === btn.id ? "var(--node-blue)" : "var(--card-bg)",
                color: activeFilter === btn.id ? "#fff" : "var(--text-muted)",
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
            backgroundColor: "var(--bg-color)",
            borderRadius: "8px",
            border: "1px solid #333",
            overflow: "hidden",
            ...(isFullscreen ? { flex: 1, minHeight: "250px" } : {}),
          }}
        >
          {/* Control panel buttons */}
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
                backgroundColor: "var(--card-bg)",
                color: "var(--text-main)",
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
                backgroundColor: "var(--card-bg)",
                color: "var(--text-main)",
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
                backgroundColor: "var(--card-bg)",
                color: "var(--text-main)",
                cursor: "pointer",
                fontSize: "9px",
                fontWeight: "bold",
              }}
            >
              Reset
            </button>
          </div>

          <svg
            ref={svgRef}
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
                <circle cx="2" cy="2" r="1.5" fill="var(--bg-color)" />
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
                stroke="var(--text-muted)"
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
                fill="var(--text-muted)"
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
                  fill="var(--card-bg)"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                />
                <text
                  x="636.5"
                  y="422"
                  textAnchor="middle"
                  fill="var(--text-main)"
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
                  fill="var(--card-bg)"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                />
                <text
                  x="1080.5"
                  y="635"
                  textAnchor="middle"
                  fill="var(--text-main)"
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
                  fill="var(--card-bg)"
                  stroke="#2979ff"
                  strokeWidth="2.5"
                />
                <text
                  x="230.5"
                  y="585"
                  textAnchor="middle"
                  fill="var(--text-main)"
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
                    fill="var(--bg-color)"
                    stroke="#2979ff"
                    strokeWidth="1.5"
                  />
                  <text
                    x="269"
                    y="637"
                    textAnchor="middle"
                    fill="var(--text-main)"
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
                    fill="var(--bg-color)"
                    stroke="#2979ff"
                    strokeWidth="1.5"
                  />
                  <text
                    x="207"
                    y="844"
                    textAnchor="middle"
                    fill="var(--text-main)"
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
                  fill="var(--card-bg)"
                  stroke="#1de9b6"
                  strokeWidth="2.5"
                />
                <text
                  x="574.5"
                  y="762"
                  textAnchor="middle"
                  fill="var(--text-main)"
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
                    fill="var(--bg-color)"
                    stroke="#1de9b6"
                    strokeWidth="1.5"
                  />
                  <text
                    x="635.5"
                    y="845"
                    textAnchor="middle"
                    fill="var(--text-main)"
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
                    fill="var(--bg-color)"
                    stroke="#1de9b6"
                    strokeWidth="1.5"
                  />
                  <text
                    x="595.5"
                    y="1131.5"
                    textAnchor="middle"
                    fill="var(--text-main)"
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
                  fill="var(--card-bg)"
                  stroke="#ff1744"
                  strokeWidth="2.5"
                />
                <text
                  x="993.5"
                  y="762"
                  textAnchor="middle"
                  fill="var(--text-main)"
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
                    fill="var(--bg-color)"
                    stroke="#ff1744"
                    strokeWidth="1.5"
                  />
                  <text
                    x="1081"
                    y="845"
                    textAnchor="middle"
                    fill="var(--text-main)"
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
                    fill="var(--bg-color)"
                    stroke="#ff1744"
                    strokeWidth="1.5"
                  />
                  <text
                    x="870"
                    y="845"
                    textAnchor="middle"
                    fill="var(--text-main)"
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
                    fill="var(--bg-color)"
                    stroke="#ff1744"
                    strokeWidth="1.5"
                  />
                  <text
                    x="889.5"
                    y="1130"
                    textAnchor="middle"
                    fill="var(--text-main)"
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
                    fill="var(--bg-color)"
                    stroke="#ff1744"
                    strokeWidth="1.5"
                  />
                  <text
                    x="1107.5"
                    y="1131"
                    textAnchor="middle"
                    fill="var(--text-main)"
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
                      stroke={link.color || "var(--text-main)"}
                      strokeWidth={active ? "3.5" : "2"}
                      fill="none"
                      strokeDasharray={link.dashed ? "6,6" : "none"}
                    />
                    {link.label && active && (
                      <text
                        x={getLinkLabelCoords(link.id).x}
                        y={getLinkLabelCoords(link.id).y}
                        fill={link.color || "var(--text-main)"}
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
                  fill="var(--card-bg)"
                  stroke={selectedDevice?.id === "client" ? "var(--text-main)" : "#a07cf8"}
                  strokeWidth={selectedDevice?.id === "client" ? 3.5 : 2.5}
                />
                <text
                  x="781.5"
                  y="78.5"
                  textAnchor="middle"
                  fill="var(--text-main)"
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
                  fill="var(--card-bg)"
                  stroke={selectedDevice?.id === "ap" ? "var(--text-main)" : "#00e5ff"}
                  strokeWidth={selectedDevice?.id === "ap" ? 3.5 : 2.5}
                />
                <text
                  x="782"
                  y="234.5"
                  textAnchor="middle"
                  fill="var(--text-main)"
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
                  fill="var(--card-bg)"
                  stroke={selectedDevice?.id === "switch" ? "var(--text-main)" : "#00b0ff"}
                  strokeWidth={selectedDevice?.id === "switch" ? 3.5 : 2.5}
                />
                <text
                  x="1424"
                  y="423.5"
                  textAnchor="middle"
                  fill="var(--text-main)"
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
                  fill="var(--card-bg)"
                  stroke={
                    selectedDevice?.id === "cyberswitch" ? "var(--text-main)" : "#ffab40"
                  }
                  strokeWidth={selectedDevice?.id === "cyberswitch" ? 3.5 : 2.5}
                />
                <text
                  x="1424"
                  y="622"
                  textAnchor="middle"
                  fill="var(--text-main)"
                  fontSize="12.5"
                  fontWeight="bold"
                >
                  Cyberswitch
                </text>
                <text
                  x="1424"
                  y="642"
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="10"
                >
                  Instructor Gateway / Internet
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Details Panel below SVG Map */}
        <div
          style={{
            marginTop: "15px",
            minHeight: "140px",
            padding: "16px",
            backgroundColor: "var(--bg-color)",
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
                        color: "#fff",
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
                    color: "var(--text-main)",
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
                      color: "var(--text-main)",
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
                          backgroundColor: "var(--bg-color)",
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
                          <span style={{ color: "var(--text-main)" }}>{inf.name}</span>
                          <span style={{ color: selectedDevice.color }}>
                            {inf.ip}
                          </span>
                        </div>
                        <div style={{ color: "var(--text-main)", fontSize: "0.75rem" }}>
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
                      color: "var(--text-main)",
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
                          backgroundColor: "var(--bg-color)",
                          borderRadius: "0 4px 4px 0",
                          fontSize: "0.8rem",
                          color: "var(--text-main)",
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
                color: "var(--text-main)",
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
