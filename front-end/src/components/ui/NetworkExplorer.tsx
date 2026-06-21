"use client";

import { useState } from "react";
import { useSvgPanZoom } from "@/lib/hooks/useSvgPanZoom";
import {
  lab1to6Data,
  lab7to9Data,
  Protocol,
  DeviceInfo,
} from "@/lib/data/networkTopology";

export default function NetworkExplorer() {
  const [selectedLab, setSelectedLab] = useState<"1-6" | "7-9">("1-6");
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<Protocol>("ALL");

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
  } = useSvgPanZoom({ minScale: 0.5, maxScale: 2.5, zoomFactor: 0.05 });

  const currentData = selectedLab === "1-6" ? lab1to6Data : lab7to9Data;

  const getDevicePos = (id: string) => {
    const d = currentData.devices.find((dev) => dev.id === id);
    return d ? { x: d.x, y: d.y } : { x: 0, y: 0 };
  };

  const isProtocolActive = (
    protocols: Protocol[],
    from?: string,
    to?: string,
  ) => {
    if (activeProtocol === "ALL") {
      if (
        selectedLab === "7-9" &&
        protocols.includes("VPNv4") &&
        from === "pe1" &&
        to === "pe2"
      ) {
        return false;
      }
      return true;
    }
    return protocols.includes(activeProtocol);
  };

  return (
    <div
      style={{
        marginTop: isFullscreen ? "0px" : "30px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        border: isFullscreen ? "none" : "1px solid #ddd",
        borderRadius: isFullscreen ? "0px" : "12px",
        overflow: "hidden",
        backgroundColor: "#0b0e14",
        color: "#fff",
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
      {/* Tabs */}
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
        <div style={{ display: "flex", flex: 1 }}>
          <button
            onClick={() => {
              setSelectedLab("1-6");
              setSelectedDevice(null);
              setActiveProtocol("ALL");
            }}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              cursor: "pointer",
              backgroundColor:
                selectedLab === "1-6" ? "#0b0e14" : "transparent",
              color: selectedLab === "1-6" ? "#fff" : "#888",
              fontWeight: selectedLab === "1-6" ? "bold" : "normal",
            }}
          >
            Enterprise Architecture
          </button>
          <button
            onClick={() => {
              setSelectedLab("7-9");
              setSelectedDevice(null);
              setActiveProtocol("ALL");
            }}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              cursor: "pointer",
              backgroundColor:
                selectedLab === "7-9" ? "#0b0e14" : "transparent",
              color: selectedLab === "7-9" ? "#fff" : "#888",
              fontWeight: selectedLab === "7-9" ? "bold" : "normal",
            }}
          >
            MPLS L3VPN
          </button>
        </div>
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
        {/* Protocol Filter */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {currentData.availableProtocols.map((proto) => (
            <button
              key={proto}
              onClick={() => setActiveProtocol(proto)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid #333",
                backgroundColor:
                  activeProtocol === proto ? "#2979ff" : "#161b22",
                color: activeProtocol === proto ? "#fff" : "#ccc",
                cursor: "pointer",
                fontSize: "0.8rem",
                transition: "all 0.2s",
              }}
            >
              {proto}
            </button>
          ))}
        </div>

        {selectedLab === "7-9" &&
          (activeProtocol === "IS-IS" || activeProtocol === "MPLS/LDP") && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "15px",
                fontSize: "0.85rem",
                color: "#8ab4f8",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <strong>Note: </strong> LDP builds label bindings over the routing
              table established by the IS-IS IGP. Because both protocols are
              active on the same backbone interfaces (PE1 &harr; P1 &harr; PE2),
              their active topologies are identical.
            </div>
          )}

        <div
          style={{
            position: "relative",
            width: "100%",
            height: isFullscreen ? "calc(100vh - 350px)" : "500px",
            backgroundColor: "#0b0e14",
            borderRadius: "8px",
            border: "1px solid #333",
            overflow: "hidden",
            ...(isFullscreen ? { flex: 1, minHeight: "250px" } : {}),
          }}
        >
          {/* Zoom Controls Overlay */}
          <div
            style={{
              position: "absolute",
              right: "15px",
              bottom: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              zIndex: 10,
            }}
          >
            <button
              onClick={zoomIn}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "4px",
                border: "1px solid #444",
                backgroundColor: "#161b22",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              +
            </button>
            <button
              onClick={zoomOut}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "4px",
                border: "1px solid #444",
                backgroundColor: "#161b22",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              -
            </button>
            <button
              onClick={resetZoom}
              style={{
                width: "45px",
                height: "25px",
                borderRadius: "4px",
                border: "1px solid #444",
                backgroundColor: "#161b22",
                color: "#fff",
                cursor: "pointer",
                fontSize: "10px",
              }}
            >
              Reset
            </button>
          </div>

          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 1000 500"
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
            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
              style={{
                transformOrigin: "500px 250px",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
            >
              {selectedLab === "7-9" && (
                <>
                  {/* MPLS Backbone Border Box */}
                  <rect
                    x="195"
                    y="130"
                    width="610"
                    height="210"
                    rx="8"
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="1.5"
                    strokeDasharray="6,6"
                    style={{
                      opacity:
                        activeProtocol === "ALL" ||
                        activeProtocol === "IS-IS" ||
                        activeProtocol === "MPLS/LDP" ||
                        activeProtocol === "VPNv4"
                          ? 0.6
                          : 0.15,
                      transition: "opacity 0.3s",
                    }}
                  />
                  <text
                    x="500"
                    y="150"
                    fill="#00e5ff"
                    textAnchor="middle"
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                      opacity:
                        activeProtocol === "ALL" ||
                        activeProtocol === "IS-IS" ||
                        activeProtocol === "MPLS/LDP" ||
                        activeProtocol === "VPNv4"
                          ? 0.8
                          : 0.2,
                      transition: "opacity 0.3s",
                    }}
                  >
                    MPLS BACKBONE
                  </text>

                  {/* VRF CLIENT-A Box PE1 */}
                  <rect
                    x="210"
                    y="180"
                    width="180"
                    height="140"
                    rx="6"
                    fill="none"
                    stroke="#a07cf8"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    style={{
                      opacity:
                        activeProtocol === "ALL" ||
                        activeProtocol === "VRF" ||
                        activeProtocol === "VPNv4" ||
                        activeProtocol === "IPsec"
                          ? 0.6
                          : 0.15,
                      transition: "opacity 0.3s",
                    }}
                  />
                  <text
                    x="300"
                    y="198"
                    fill="#a07cf8"
                    textAnchor="middle"
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      opacity:
                        activeProtocol === "ALL" ||
                        activeProtocol === "VRF" ||
                        activeProtocol === "VPNv4" ||
                        activeProtocol === "IPsec"
                          ? 0.8
                          : 0.2,
                      transition: "opacity 0.3s",
                    }}
                  >
                    VRF CLIENT-A
                  </text>

                  {/* VRF CLIENT-A Box PE2 */}
                  <rect
                    x="610"
                    y="180"
                    width="180"
                    height="140"
                    rx="6"
                    fill="none"
                    stroke="#a07cf8"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    style={{
                      opacity:
                        activeProtocol === "ALL" ||
                        activeProtocol === "VRF" ||
                        activeProtocol === "VPNv4" ||
                        activeProtocol === "IPsec"
                          ? 0.6
                          : 0.15,
                      transition: "opacity 0.3s",
                    }}
                  />
                  <text
                    x="700"
                    y="198"
                    fill="#a07cf8"
                    textAnchor="middle"
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      opacity:
                        activeProtocol === "ALL" ||
                        activeProtocol === "VRF" ||
                        activeProtocol === "VPNv4" ||
                        activeProtocol === "IPsec"
                          ? 0.8
                          : 0.2,
                      transition: "opacity 0.3s",
                    }}
                  >
                    VRF CLIENT-A
                  </text>

                  {/* IPsec Tunnel Label Text above curve */}
                  <text
                    x="500"
                    y="70"
                    fill="#ff1744"
                    textAnchor="middle"
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      opacity:
                        activeProtocol === "ALL" || activeProtocol === "IPsec"
                          ? 1
                          : 0.15,
                      transition: "opacity 0.3s",
                    }}
                  >
                    IPsec tunnel (CE1-A --- CE2-A)
                  </text>

                  {/* Subnets below CE routers */}
                  <text
                    x="100"
                    y="315"
                    fill="#888"
                    textAnchor="middle"
                    style={{
                      fontSize: "11px",
                      opacity:
                        activeProtocol === "ALL" ||
                        activeProtocol === "VRF" ||
                        activeProtocol === "IPsec"
                          ? 0.8
                          : 0.2,
                      transition: "opacity 0.3s",
                    }}
                  >
                    10.1.0.0/24
                  </text>
                  <text
                    x="900"
                    y="315"
                    fill="#888"
                    textAnchor="middle"
                    style={{
                      fontSize: "11px",
                      opacity:
                        activeProtocol === "ALL" ||
                        activeProtocol === "VRF" ||
                        activeProtocol === "IPsec"
                          ? 0.8
                          : 0.2,
                      transition: "opacity 0.3s",
                    }}
                  >
                    10.2.0.0/24
                  </text>
                </>
              )}

              {/* Connections */}
              {currentData.connections.map((conn, i) => {
                const start = getDevicePos(conn.from);
                const end = getDevicePos(conn.to);
                const active = isProtocolActive(
                  conn.protocols,
                  conn.from,
                  conn.to,
                );

                if (conn.curved) {
                  const midX = (start.x + end.x) / 2;
                  const offset = conn.curveOffset || 100;
                  const midY = Math.min(start.y, end.y) - offset;
                  return (
                    <path
                      key={i}
                      d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                      stroke={conn.color || "#444"}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={conn.dashed ? "5,5" : "none"}
                      style={{
                        opacity: active ? 1 : 0.1,
                        transition: "opacity 0.3s",
                      }}
                      className={active ? "pulse-path" : ""}
                    />
                  );
                }

                return (
                  <line
                    key={i}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={conn.color || "#444"}
                    strokeWidth="2"
                    strokeDasharray={conn.dashed ? "5,5" : "none"}
                    style={{
                      opacity: active ? 1 : 0.1,
                      transition: "opacity 0.3s",
                    }}
                  />
                );
              })}

              {/* Devices */}
              {currentData.devices.map((device) => {
                const active = isProtocolActive(device.protocols);
                return (
                  <g
                    key={device.id}
                    onClick={() => {
                      setSelectedDevice(device);
                    }}
                    style={{
                      cursor: "pointer",
                      opacity: active ? 1 : 0.2,
                      transition: "opacity 0.3s",
                    }}
                    className="device-group"
                  >
                    <rect
                      x={device.x - 60}
                      y={device.y - 25}
                      width="120"
                      height="50"
                      rx="4"
                      fill="#0b0e14"
                      stroke={
                        selectedDevice?.id === device.id
                          ? "#fff"
                          : device.color || "#00e5ff"
                      }
                      strokeWidth={selectedDevice?.id === device.id ? "3" : "2"}
                      className="device-rect"
                    />
                    <text
                      x={device.x}
                      y={device.y + 5}
                      textAnchor="middle"
                      fill="#fff"
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        pointerEvents: "none",
                      }}
                    >
                      {device.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {selectedLab === "7-9" && (
          <div
            style={{
              marginTop: "15px",
              textAlign: "center",
              fontSize: "0.85rem",
              color: "#aaa",
              borderTop: "1px solid #222",
              paddingTop: "12px",
              lineHeight: "1.6",
            }}
          >
            <div>
              <span style={{ color: "#a07cf8", fontWeight: "bold" }}>
                Tunnel0 source
              </span>{" "}
              = local loopback (reachable via L3VPN) &middot;{" "}
              <span style={{ color: "#a07cf8", fontWeight: "bold" }}>
                destination
              </span>{" "}
              = remote loopback
            </div>
            <div
              style={{ marginTop: "4px", fontSize: "0.8rem", color: "#888" }}
            >
              L3VPN provides{" "}
              <span style={{ color: "#00e5ff", fontWeight: "600" }}>
                reachability
              </span>{" "}
              &middot; IPsec provides{" "}
              <span style={{ color: "#ff1744", fontWeight: "600" }}>
                encryption
              </span>
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#161b22",
            borderRadius: "8px",
            border: "1px solid #333",
            minHeight: "150px",
            ...(isFullscreen
              ? {
                  maxHeight: "220px",
                  overflowY: "auto",
                }
              : {}),
          }}
        >
          {selectedDevice ? (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  borderBottom: "1px solid #333",
                  paddingBottom: "10px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: selectedDevice.color || "#00e5ff",
                    }}
                  >
                    {selectedDevice.name} Configuration
                  </h3>
                  <div
                    style={{ display: "flex", gap: "5px", marginTop: "5px" }}
                  >
                    {selectedDevice.protocols.map((p) => (
                      <span
                        key={p}
                        style={{
                          fontSize: "0.6rem",
                          padding: "2px 6px",
                          backgroundColor: "#333",
                          borderRadius: "10px",
                          color: "#888",
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <h5
                    style={{
                      color: "#888",
                      marginBottom: "10px",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Interfaces
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {selectedDevice.interfaces.map((intf, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: "#0b0e14",
                          padding: "8px",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          border: "1px solid #333",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {intf.name}
                          </span>
                          <span style={{ color: "#00e5ff" }}>{intf.ip}</span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#666",
                            marginTop: "4px",
                          }}
                        >
                          {intf.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5
                    style={{
                      color: "#888",
                      marginBottom: "10px",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Global Settings
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {selectedDevice.config.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: "0.85rem",
                          padding: "4px 10px",
                          borderLeft: "2px solid #333",
                          color: "#ccc",
                        }}
                      >
                        {c}
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
                height: "100%",
                color: "#666",
                textAlign: "center",
              }}
            >
              <p>
                Select a router or filter by protocol above to explore the
                network architecture.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .device-group:hover .device-rect {
          filter: brightness(1.3);
        }
        .pulse-path {
          animation: dash 20s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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
