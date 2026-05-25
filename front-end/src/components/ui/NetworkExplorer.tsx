'use client';

import { useState } from 'react';

type Protocol = 'ALL' | 'IS-IS' | 'eBGP' | 'iBGP' | 'MPLS/LDP' | 'VPNv4' | 'VRF';

interface DeviceInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  color?: string;
  protocols: Protocol[];
  interfaces: { name: string; ip: string; desc: string }[];
  config: string[];
}

interface Connection {
  from: string;
  to: string;
  dashed?: boolean;
  color?: string;
  curved?: boolean;
  protocols: Protocol[];
}

interface TopologyData {
  title: string;
  availableProtocols: Protocol[];
  devices: DeviceInfo[];
  connections: Connection[];
}

const lab1to6Data: TopologyData = {
  title: "Lab 1-6: Enterprise & ISP Infrastructure",
  availableProtocols: ['ALL', 'IS-IS', 'eBGP', 'iBGP', 'VRF'],
  devices: [
    { id: "ispa", name: "ISP-A", x: 300, y: 50, color: "#e65100", protocols: ['eBGP'], interfaces: [{ name: "Loopback0", ip: "8.8.8.1/32", desc: "Internet Simulator" }, { name: "Gi0/0", ip: "198.51.100.1/30", desc: "WAN to EDGE-R1" }], config: ["ASN: 65001", "BGP: Advertising 0.0.0.0/0"] },
    { id: "ispb", name: "ISP-B", x: 600, y: 50, color: "#e65100", protocols: ['eBGP'], interfaces: [{ name: "Loopback0", ip: "9.9.9.1/32", desc: "Internet Simulator" }, { name: "Gi0/0", ip: "198.51.200.1/30", desc: "WAN to EDGE-R2" }], config: ["ASN: 65002", "BGP: Backup Upstream"] },
    { id: "edge1", name: "EDGE-R1", x: 300, y: 150, color: "#00acc1", protocols: ['IS-IS', 'eBGP', 'iBGP'], interfaces: [{ name: "Loopback0", ip: "10.255.0.1/32", desc: "Router ID" }, { name: "Gi0/0", ip: "198.51.100.2/30", desc: "WAN to ISP-A" }], config: ["ASN: 65100", "Local Pref: 200 (Primary)"] },
    { id: "edge2", name: "EDGE-R2", x: 600, y: 150, color: "#00acc1", protocols: ['IS-IS', 'eBGP', 'iBGP'], interfaces: [{ name: "Loopback0", ip: "10.255.255.2/32", desc: "Router ID" }, { name: "Gi0/0", ip: "198.51.200.2/30", desc: "WAN to ISP-B" }], config: ["ASN: 65100", "Local Pref: 100"] },
    { id: "core1", name: "CORE-R1", x: 250, y: 280, color: "#00838f", protocols: ['IS-IS', 'iBGP', 'VRF'], interfaces: [{ name: "Loopback0", ip: "10.255.0.2/32", desc: "Router ID" }, { name: "Gi0/3", ip: "192.168.100.1/30", desc: "VRF KLANT-A" }], config: ["IS-IS L1/L2", "VRF-Lite Config"] },
    { id: "core2", name: "CORE-R2", x: 650, y: 280, color: "#00838f", protocols: ['IS-IS', 'iBGP'], interfaces: [{ name: "Loopback0", ip: "10.255.0.5/32", desc: "Router ID" }], config: ["IS-IS L1/L2", "iBGP Peer"] },
    { id: "dist1", name: "DIST-R1", x: 550, y: 400, color: "#43a047", protocols: ['IS-IS'], interfaces: [{ name: "Loopback0", ip: "10.255.0.3/32", desc: "Router ID" }], config: ["IS-IS L1-Only"] },
    { id: "dist2", name: "DIST-R2", x: 750, y: 400, color: "#43a047", protocols: ['IS-IS'], interfaces: [{ name: "Loopback0", ip: "10.255.0.4/32", desc: "Router ID" }], config: ["IS-IS L1-Only"] },
    { id: "routera", name: "Router-A", x: 150, y: 400, color: "#fbc02d", protocols: ['VRF'], interfaces: [{ name: "Gi0/0", ip: "192.168.100.2/30", desc: "WAN to CORE-R1" }], config: ["VRF Client A"] },
    { id: "routerb", name: "Router-B", x: 350, y: 400, color: "#fbc02d", protocols: ['VRF'], interfaces: [{ name: "Gi0/0", ip: "192.168.200.2/30", desc: "WAN to CORE-R1" }], config: ["VRF Client B"] },
  ],
  connections: [
    { from: "ispa", to: "edge1", color: "#e65100", protocols: ['eBGP'] },
    { from: "ispb", to: "edge2", color: "#e65100", protocols: ['eBGP'] },
    { from: "edge1", to: "edge2", dashed: true, color: "#999", protocols: ['iBGP'] },
    { from: "edge1", to: "core1", protocols: ['IS-IS', 'iBGP'] },
    { from: "edge1", to: "core2", protocols: ['IS-IS', 'iBGP'] },
    { from: "edge2", to: "core1", protocols: ['IS-IS', 'iBGP'] },
    { from: "edge2", to: "core2", protocols: ['IS-IS', 'iBGP'] },
    { from: "core1", to: "core2", color: "#00acc1", protocols: ['IS-IS'] },
    { from: "core1", to: "routera", dashed: true, color: "#fbc02d", protocols: ['VRF'] },
    { from: "core1", to: "routerb", dashed: true, color: "#fbc02d", protocols: ['VRF'] },
    { from: "core1", to: "dist1", protocols: ['IS-IS'] },
    { from: "core2", to: "dist2", protocols: ['IS-IS'] },
  ]
};

const lab7to9Data: TopologyData = {
  title: "Lab 7-9: MPLS Service Provider Backbone",
  availableProtocols: ['ALL', 'IS-IS', 'MPLS/LDP', 'VPNv4', 'VRF'],
  devices: [
    { id: "ce1a", name: "CE1-A", x: 100, y: 250, color: "#7e57c2", protocols: ['VRF'], interfaces: [{ name: "Gi0/0", ip: "192.168.1.2/30", desc: "Link to PE1" }, { name: "Gi0/1", ip: "10.1.0.1/24", desc: "LAN Site 1" }], config: ["Customer Edge"] },
    { id: "pe1", name: "PE1", x: 300, y: 250, color: "#00acc1", protocols: ['IS-IS', 'MPLS/LDP', 'VPNv4', 'VRF'], interfaces: [{ name: "Loopback0", ip: "10.255.0.1/32", desc: "LDP ID" }, { name: "Gi0/0", ip: "10.0.0.1/30", desc: "MPLS to P1" }], config: ["MPLS/LDP", "VRF KLANT-A"] },
    { id: "p1", name: "P1", x: 500, y: 250, color: "#00838f", protocols: ['IS-IS', 'MPLS/LDP'], interfaces: [{ name: "Loopback0", ip: "10.255.0.2/32", desc: "LDP ID" }], config: ["Label Switching Router"] },
    { id: "pe2", name: "PE2", x: 700, y: 250, color: "#00acc1", protocols: ['IS-IS', 'MPLS/LDP', 'VPNv4', 'VRF'], interfaces: [{ name: "Loopback0", ip: "10.255.0.3/32", desc: "LDP ID" }], config: ["MPLS/LDP", "VRF KLANT-A"] },
    { id: "ce2a", name: "CE2-A", x: 900, y: 250, color: "#7e57c2", protocols: ['VRF'], interfaces: [{ name: "Gi0/0", ip: "192.168.2.2/30", desc: "Link to PE2" }, { name: "Gi0/1", ip: "10.2.0.1/24", desc: "LAN Site 2" }], config: ["Customer Edge"] },
  ],
  connections: [
    { from: "ce1a", to: "pe1", protocols: ['VRF'] },
    { from: "pe1", to: "p1", protocols: ['IS-IS', 'MPLS/LDP'] },
    { from: "p1", to: "pe2", protocols: ['IS-IS', 'MPLS/LDP'] },
    { from: "pe2", to: "ce2a", protocols: ['VRF'] },
    { from: "pe1", to: "pe2", dashed: true, color: "#66bb6a", curved: true, protocols: ['VPNv4'] },
  ]
};

export default function NetworkExplorer() {
  const [selectedLab, setSelectedLab] = useState<'1-6' | '7-9'>('1-6');
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<Protocol>('ALL');

  const currentData = selectedLab === '1-6' ? lab1to6Data : lab7to9Data;

  const getDevicePos = (id: string) => {
    const d = currentData.devices.find(dev => dev.id === id);
    return d ? { x: d.x, y: d.y } : { x: 0, y: 0 };
  };

  const isProtocolActive = (protocols: Protocol[]) => {
    if (activeProtocol === 'ALL') return true;
    return protocols.includes(activeProtocol);
  };

  return (
    <div style={{ marginTop: "30px", border: "1px solid #ddd", borderRadius: "12px", overflow: "hidden", backgroundColor: "#0b0e14", color: "#fff" }}>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #333", backgroundColor: "#161b22" }}>
        <button 
          onClick={() => { setSelectedLab('1-6'); setSelectedDevice(null); setActiveProtocol('ALL'); }}
          style={{ 
            flex: 1, padding: "12px", border: "none", cursor: "pointer",
            backgroundColor: selectedLab === '1-6' ? "#0b0e14" : "transparent",
            color: selectedLab === '1-6' ? "#fff" : "#888",
            fontWeight: selectedLab === '1-6' ? "bold" : "normal"
          }}
        >
          Labs 1-6 (Enterprise Architecture)
        </button>
        <button 
          onClick={() => { setSelectedLab('7-9'); setSelectedDevice(null); setActiveProtocol('ALL'); }}
          style={{ 
            flex: 1, padding: "12px", border: "none", cursor: "pointer",
            backgroundColor: selectedLab === '7-9' ? "#0b0e14" : "transparent",
            color: selectedLab === '7-9' ? "#fff" : "#888",
            fontWeight: selectedLab === '7-9' ? "bold" : "normal"
          }}
        >
          Labs 7-9 (MPLS L3VPN)
        </button>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Protocol Filter */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          {currentData.availableProtocols.map(proto => (
            <button
              key={proto}
              onClick={() => setActiveProtocol(proto)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid #333",
                backgroundColor: activeProtocol === proto ? "#00acc1" : "#161b22",
                color: activeProtocol === proto ? "#fff" : "#ccc",
                cursor: "pointer",
                fontSize: "0.8rem",
                transition: "all 0.2s"
              }}
            >
              {proto}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", width: "100%", height: "500px", backgroundColor: "#0b0e14", borderRadius: "8px", border: "1px solid #333" }}>
          <svg width="100%" height="100%" viewBox="0 0 1000 500" style={{ position: "absolute", top: 0, left: 0 }}>
            {/* Connections */}
            {currentData.connections.map((conn, i) => {
              const start = getDevicePos(conn.from);
              const end = getDevicePos(conn.to);
              const active = isProtocolActive(conn.protocols);
              
              if (conn.curved) {
                const midX = (start.x + end.x) / 2;
                const midY = Math.min(start.y, end.y) - 100;
                return (
                  <path 
                    key={i}
                    d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                    stroke={conn.color || "#444"}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={conn.dashed ? "5,5" : "none"}
                    style={{ opacity: active ? 1 : 0.1, transition: "opacity 0.3s" }}
                    className={active ? "pulse-path" : ""}
                  />
                );
              }
              
              return (
                <line 
                  key={i}
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke={conn.color || "#444"}
                  strokeWidth="2"
                  strokeDasharray={conn.dashed ? "5,5" : "none"}
                  style={{ opacity: active ? 1 : 0.1, transition: "opacity 0.3s" }}
                />
              );
            })}

            {/* Devices */}
            {currentData.devices.map((device) => {
              const active = isProtocolActive(device.protocols);
              return (
                <g 
                  key={device.id} 
                  onClick={() => setSelectedDevice(device)}
                  style={{ cursor: "pointer", opacity: active ? 1 : 0.2, transition: "opacity 0.3s" }}
                  className="device-group"
                >
                  <rect 
                    x={device.x - 60} 
                    y={device.y - 25} 
                    width="120" 
                    height="50" 
                    rx="4"
                    fill="#0b0e14"
                    stroke={selectedDevice?.id === device.id ? "#fff" : (device.color || "#00acc1")}
                    strokeWidth={selectedDevice?.id === device.id ? "3" : "2"}
                    className="device-rect"
                  />
                  <text 
                    x={device.x} 
                    y={device.y + 5} 
                    textAnchor="middle" 
                    fill="#fff" 
                    style={{ fontSize: "14px", fontWeight: "bold", pointerEvents: "none" }}
                  >
                    {device.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Info Panel */}
        <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#161b22", borderRadius: "8px", border: "1px solid #333", minHeight: "150px" }}>
          {selectedDevice ? (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: "1px solid #333", paddingBottom: "10px" }}>
                <div>
                  <h3 style={{ margin: 0, color: selectedDevice.color || "#00acc1" }}>{selectedDevice.name} Configuration</h3>
                  <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                    {selectedDevice.protocols.map(p => (
                      <span key={p} style={{ fontSize: "0.6rem", padding: "2px 6px", backgroundColor: "#333", borderRadius: "10px", color: "#888" }}>{p}</span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: "0.8rem", color: "#888" }}>Status: Operational</span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <h5 style={{ color: "#888", marginBottom: "10px", fontSize: "0.7rem", textTransform: "uppercase" }}>Interfaces</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {selectedDevice.interfaces.map((intf, i) => (
                      <div key={i} style={{ backgroundColor: "#0b0e14", padding: "8px", borderRadius: "4px", fontSize: "0.85rem", border: "1px solid #333" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: "bold" }}>{intf.name}</span>
                          <span style={{ color: "#00acc1" }}>{intf.ip}</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "4px" }}>{intf.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 style={{ color: "#888", marginBottom: "10px", fontSize: "0.7rem", textTransform: "uppercase" }}>Global Settings</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {selectedDevice.config.map((c, i) => (
                      <div key={i} style={{ fontSize: "0.85rem", padding: "4px 10px", borderLeft: "2px solid #333", color: "#ccc" }}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#666", textAlign: "center" }}>
              <p>Select a router or filter by protocol above to explore the network architecture.</p>
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
