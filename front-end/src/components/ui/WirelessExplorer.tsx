'use client';

import { useState, useEffect, useRef } from 'react';

type WirelessFilter = 'ALL' | 'INFRASTRUCTURE' | 'VLANS' | 'CAPWAP' | '802.1X' | 'PORTAL';

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
  from: string;
  to: string;
  fromCoords?: { x: number; y: number };
  toCoords?: { x: number; y: number };
  dashed?: boolean;
  curved?: boolean;
  curveOffset?: number;
  color?: string;
  filters: WirelessFilter[];
  label?: string;
}

const wirelessDevices: WirelessDevice[] = [
  {
    id: 'client',
    name: 'Client Device',
    x: 500,
    y: 35,
    width: 140,
    height: 50,
    color: '#7e57c2',
    filters: ['INFRASTRUCTURE', 'VLANS', '802.1X', 'PORTAL'],
    interfaces: [
      { name: 'wlan0', ip: 'DHCP Assigned', desc: 'Wireless Interface connecting to AP' }
    ],
    config: [
      'Corporate: WPA3-Enterprise (802.1X PEAP)',
      'Guest: Captive Portal redirect',
      'IoT: WPA2-PSK Protected'
    ],
    desc: 'Wireless client (laptop, phone, or IoT) connecting to the enterprise WLAN SSIDs.'
  },
  {
    id: 'ap',
    name: 'Cisco Access Point',
    x: 430,
    y: 130,
    width: 165,
    height: 45,
    color: '#00acc1',
    filters: ['INFRASTRUCTURE', 'VLANS', 'CAPWAP', '802.1X', 'PORTAL'],
    interfaces: [
      { name: 'GigabitEthernet0', ip: '10.0.X.10 (DHCP)', desc: 'PoE Ethernet Port (Mgmt VLAN)' },
      { name: 'Radio0 (2.4GHz)', ip: 'SSID Broadcast', desc: 'IoT / Legacy devices' },
      { name: 'Radio1 (5GHz)', ip: 'SSID Broadcast', desc: 'Corporate / Guest clients' }
    ],
    config: [
      'CAPWAP Mode: Lightweight AP',
      'WLC IP: Discovered via Option 43 / DNS CAPWAP Override',
      'Management VLAN: Assigned native VLAN'
    ],
    desc: 'Lightweight Access Point bridging wireless client airwaves to the CAPWAP tunnel mapped back to WLC.'
  },
  {
    id: 'switch',
    name: 'Managed Switch',
    x: 770,
    y: 200,
    width: 170,
    height: 50,
    color: '#00838f',
    filters: ['INFRASTRUCTURE', 'VLANS'],
    interfaces: [
      { name: 'Gi0/1', ip: 'Unnumbered', desc: 'Trunk port to Proxmox Host' },
      { name: 'Gi0/2', ip: 'Unnumbered', desc: 'Trunk port to Cyberswitch Gateway' },
      { name: 'Gi0/5', ip: 'Unnumbered', desc: 'Access port to AP (Native Mgmt VLAN)' },
      { name: 'VLAN XX (Mgmt)', ip: '10.0.X.254/24', desc: 'Switch Management interface' }
    ],
    config: [
      'VLANs: Mgmt (XX), Corporate (100), Guest (200), IoT (300)',
      'Gi0/1 Trunk: switchport trunk allowed vlan XX,100,200,300',
      'Gi0/5 Access: switchport access vlan XX (AP Management)'
    ],
    desc: 'Physical Cisco Managed Switch connecting physical devices (like APs and Upstream network) to virtual environments on Proxmox.'
  },
  {
    id: 'cyberswitch',
    name: 'Cyberswitch Gateway',
    x: 770,
    y: 360,
    width: 170,
    height: 55,
    color: '#e65100',
    filters: ['INFRASTRUCTURE'],
    interfaces: [
      { name: 'Upstream Gateway', ip: '10.0.0.1 (External)', desc: 'UCLL Lab Instructor Router' }
    ],
    config: [
      'Provides NAT to external internet',
      'Acts as DHCP server for student switch WAN interface'
    ],
    desc: 'Upstream laboratory network providing DHCP, general internet routing, and access to campus resources.'
  },
  {
    id: 'wlc',
    name: 'Cisco 9800-CL WLC VM',
    x: 60,
    y: 380,
    width: 200,
    height: 215,
    color: '#42a5f5',
    filters: ['INFRASTRUCTURE', 'VLANS', 'CAPWAP', '802.1X', 'PORTAL'],
    interfaces: [
      { name: 'GigabitEthernet1', ip: '10.0.X.2/24', desc: 'Management Interface (VLAN XX)' },
      { name: 'Wireless Management', ip: '10.0.X.2', desc: 'CAPWAP Tunnel Terminator' }
    ],
    config: [
      'SSID 1: Corporate (VLAN 100, WPA3 802.1X PEAP)',
      'SSID 2: Guest (VLAN 200, LWA Web Portal + Redirect)',
      'SSID 3: IoT (VLAN 300, WPA2-PSK)',
      'RADIUS server: 10.0.X.3 (UDP 1812/1813 auth/acct)'
    ],
    desc: 'Cisco Catalyst 9800-CL Virtual Wireless LAN Controller (running on Proxmox). Terminates client CAPWAP tunnels and controls AP policies.'
  },
  {
    id: 'radius',
    name: 'FreeRADIUS LXC Container',
    x: 290,
    y: 480,
    width: 200,
    height: 215,
    color: '#26a69a',
    filters: ['INFRASTRUCTURE', '802.1X', 'PORTAL'],
    interfaces: [
      { name: 'eth0', ip: '10.0.X.3/24', desc: 'Management interface connecting to vmbr1' }
    ],
    config: [
      'Auth Method: PEAP-MSCHAPv2',
      'Port bindings: UDP 1812 (Authentication), UDP 1813 (Accounting)',
      'NAS Clients: WLC (10.0.X.2) added to clients.conf with shared secret'
    ],
    desc: 'FreeRADIUS running in a Proxmox LXC container. Handles authentication requests from the WLC (Authenticator) and validates client credentials.'
  },
  {
    id: 'opnsense',
    name: 'OPNsense Firewall VM',
    x: 530,
    y: 480,
    width: 240,
    height: 215,
    color: '#ef5350',
    filters: ['INFRASTRUCTURE', 'VLANS', 'PORTAL'],
    interfaces: [
      { name: 'vtnet0 / NIC 1 (WAN)', ip: 'DHCP assigned', desc: 'Upstream route to Switch & Cyberswitch' },
      { name: 'vtnet1 / NIC 2 (OPT1)', ip: '10.0.X.1/24', desc: 'Management VLAN Gateway' },
      { name: 'vtnet0_vlan100 (Corporate)', ip: '192.168.100.1/24', desc: 'Gateway for SSID Corporate' },
      { name: 'vtnet0_vlan200 (Guest)', ip: '192.168.200.1/24', desc: 'Gateway for SSID Guest' },
      { name: 'vtnet0_vlan300 (IoT)', ip: '192.168.30.1/24', desc: 'Gateway for SSID IoT' }
    ],
    config: [
      'Services: DHCP Pools for VLANs XX, 100, 200, 300',
      'DHCP Option 43: Hexadecimal TLV for WLC discovery',
      'DNS Overrides: cisco-capwap-controller -> 10.0.X.2',
      'Firewall Rules: Inter-VLAN isolation (block Guest/IoT access to Corporate)'
    ],
    desc: 'Virtual firewall and router hosting DHCP scopes, outbound NAT rules, and firewall isolation policies.'
  }
];

const wirelessLinks: WirelessLink[] = [
  // Client to AP
  {
    from: 'client',
    to: 'ap',
    fromCoords: { x: 570, y: 85 },
    toCoords: { x: 512, y: 130 },
    color: '#7e57c2',
    filters: ['INFRASTRUCTURE', 'VLANS', '802.1X', 'PORTAL'],
    label: '1. Wi-Fi Airwaves'
  },
  // AP to Switch
  {
    from: 'ap',
    to: 'switch',
    fromCoords: { x: 595, y: 152 },
    toCoords: { x: 855, y: 200 },
    color: '#00838f',
    filters: ['INFRASTRUCTURE'],
    label: '2. Physical Cable (Mgmt VLAN)'
  },
  // Switch to Cyberswitch
  {
    from: 'switch',
    to: 'cyberswitch',
    fromCoords: { x: 855, y: 250 },
    toCoords: { x: 855, y: 360 },
    color: '#e65100',
    filters: ['INFRASTRUCTURE'],
    label: 'Outbound Internet'
  },
  // Switch to vmbr0 Bridge
  {
    from: 'switch',
    to: 'vmbr0',
    fromCoords: { x: 770, y: 225 },
    toCoords: { x: 630, y: 400 },
    color: '#00838f',
    filters: ['INFRASTRUCTURE', 'VLANS'],
    label: '3. Physical Trunk Cable'
  },
  // vmbr0 to vtnet0
  {
    from: 'vmbr0',
    to: 'vtnet0',
    fromCoords: { x: 630, y: 450 },
    toCoords: { x: 665, y: 505 },
    color: '#fff',
    filters: ['INFRASTRUCTURE', 'VLANS']
  },
  // Inside WLC VM (GigabitEthernet1 to Routing Engine)
  {
    from: 'ge1',
    to: 'wlc_engine',
    fromCoords: { x: 160, y: 435 },
    toCoords: { x: 160, y: 475 },
    color: '#42a5f5',
    filters: ['INFRASTRUCTURE', 'CAPWAP']
  },
  // vmbr1 Bridge to GigabitEthernet1 (WLC)
  {
    from: 'vmbr1',
    to: 'ge1',
    fromCoords: { x: 360, y: 330 },
    toCoords: { x: 160, y: 405 },
    color: '#fff',
    filters: ['INFRASTRUCTURE', 'CAPWAP']
  },
  // vmbr1 Bridge to eth0 (RADIUS)
  {
    from: 'vmbr1',
    to: 'eth0',
    fromCoords: { x: 390, y: 330 },
    toCoords: { x: 390, y: 505 },
    color: '#fff',
    filters: ['INFRASTRUCTURE', '802.1X']
  },
  // eth0 to RADIUS engine
  {
    from: 'eth0',
    to: 'radius_engine',
    fromCoords: { x: 390, y: 535 },
    toCoords: { x: 390, y: 575 },
    color: '#26a69a',
    filters: ['INFRASTRUCTURE', '802.1X']
  },
  // vmbr1 Bridge to vtnet1 (OPNsense)
  {
    from: 'vmbr1',
    to: 'vtnet1',
    fromCoords: { x: 420, y: 330 },
    toCoords: { x: 592, y: 505 },
    color: '#fff',
    filters: ['INFRASTRUCTURE']
  },
  // vtnet1 to OPT1 Bridge
  {
    from: 'vtnet1',
    to: 'opt1',
    fromCoords: { x: 592, y: 535 },
    toCoords: { x: 592, y: 577 },
    color: '#ef5350',
    filters: ['INFRASTRUCTURE']
  },
  // Virtual CAPWAP tunnel (Client to WLC Engine)
  {
    from: 'ap',
    to: 'wlc_engine',
    fromCoords: { x: 430, y: 152 },
    toCoords: { x: 160, y: 505 },
    dashed: true,
    curved: true,
    curveOffset: 120,
    color: '#00acc1',
    filters: ['CAPWAP'],
    label: 'CAPWAP Tunnel (Client Traffic)'
  },
  // Virtual RADIUS link (WLC to FreeRADIUS)
  {
    from: 'wlc_engine',
    to: 'radius_engine',
    fromCoords: { x: 190, y: 505 },
    toCoords: { x: 360, y: 605 },
    dashed: true,
    curved: true,
    curveOffset: -40,
    color: '#26a69a',
    filters: ['802.1X', 'PORTAL'],
    label: 'RADIUS (UDP 1812/1813)'
  }
];

export default function WirelessExplorer() {
  const [activeFilter, setActiveFilter] = useState<WirelessFilter>('ALL');
  const [selectedDevice, setSelectedDevice] = useState<WirelessDevice | null>(null);

  // Zoom & Pan State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomFactor = 0.05;
        if (e.deltaY < 0) {
          setScale((prev) => Math.min(prev + zoomFactor, 2.5));
        } else {
          setScale((prev) => Math.max(prev - zoomFactor, 0.5));
        }
      }
    };

    svgEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      svgEl.removeEventListener("wheel", handleWheel);
    };
  }, []);

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

  const getDevicePos = (id: string) => {
    const d = wirelessDevices.find(dev => dev.id === id);
    if (d) {
      return { x: d.x + (d.width || 120) / 2, y: d.y + (d.height || 50) / 2 };
    }
    return { x: 0, y: 0 };
  };

  const isFilterActive = (filters: WirelessFilter[]) => {
    if (activeFilter === 'ALL') return true;
    return filters.includes(activeFilter);
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
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.15, 2.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.5));
  const resetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div style={{
      marginTop: isFullscreen ? '0px' : '30px',
      marginRight: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      border: isFullscreen ? 'none' : '1px solid #ddd',
      borderRadius: isFullscreen ? '0px' : '12px',
      overflow: 'hidden',
      backgroundColor: '#0b0e14',
      color: '#fff',
      ...(isFullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
      } : {})
    }}>
      {/* Toggles */}
      <div style={{ display: 'flex', borderBottom: '1px solid #333', backgroundColor: '#161b22', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
        <button 
          onClick={() => { setActiveFilter('ALL'); setSelectedDevice(null); }}
          style={{ flex: 1, padding: '12px 10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', backgroundColor: activeFilter === 'ALL' ? '#0b0e14' : 'transparent', color: activeFilter === 'ALL' ? '#fff' : '#888', fontWeight: activeFilter === 'ALL' ? 'bold' : 'normal' }}
        >
          All Layers
        </button>
        <button 
          onClick={() => { setActiveFilter('INFRASTRUCTURE'); setSelectedDevice(null); }}
          style={{ flex: 1, padding: '12px 10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', backgroundColor: activeFilter === 'INFRASTRUCTURE' ? '#0b0e14' : 'transparent', color: activeFilter === 'INFRASTRUCTURE' ? '#fff' : '#888', fontWeight: activeFilter === 'INFRASTRUCTURE' ? 'bold' : 'normal' }}
        >
          Infrastructure (Physical & Virtual)
        </button>
        <button 
          onClick={() => { setActiveFilter('VLANS'); setSelectedDevice(null); }}
          style={{ flex: 1, padding: '12px 10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', backgroundColor: activeFilter === 'VLANS' ? '#0b0e14' : 'transparent', color: activeFilter === 'VLANS' ? '#fff' : '#888', fontWeight: activeFilter === 'VLANS' ? 'bold' : 'normal' }}
        >
          VLAN Trunking / Subnets
        </button>
        <button 
          onClick={() => { setActiveFilter('CAPWAP'); setSelectedDevice(null); }}
          style={{ flex: 1, padding: '12px 10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', backgroundColor: activeFilter === 'CAPWAP' ? '#0b0e14' : 'transparent', color: activeFilter === 'CAPWAP' ? '#fff' : '#888', fontWeight: activeFilter === 'CAPWAP' ? 'bold' : 'normal' }}
        >
          CAPWAP Tunnel
        </button>
        <button 
          onClick={() => { setActiveFilter('802.1X'); setSelectedDevice(null); }}
          style={{ flex: 1, padding: '12px 10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', backgroundColor: activeFilter === '802.1X' ? '#0b0e14' : 'transparent', color: activeFilter === '802.1X' ? '#fff' : '#888', fontWeight: activeFilter === '802.1X' ? 'bold' : 'normal' }}
        >
          802.1X & RADIUS
        </button>
        <button 
          onClick={() => { setActiveFilter('PORTAL'); setSelectedDevice(null); }}
          style={{ flex: 1, padding: '12px 10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', backgroundColor: activeFilter === 'PORTAL' ? '#0b0e14' : 'transparent', color: activeFilter === 'PORTAL' ? '#fff' : '#888', fontWeight: activeFilter === 'PORTAL' ? 'bold' : 'normal' }}
        >
          Captive Portal (Guest LWA)
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

      <div style={{
        padding: '20px',
        ...(isFullscreen ? {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        } : {})
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: isFullscreen ? 'calc(100vh - 350px)' : '680px',
          backgroundColor: '#0b0e14',
          borderRadius: '8px',
          border: '1px solid #333',
          overflow: 'hidden',
          ...(isFullscreen ? { flex: 1, minHeight: '250px' } : {})
        }}>
          {/* Zoom Controls Overlay */}
          <div style={{ position: 'absolute', right: '15px', bottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 10 }}>
            <button onClick={zoomIn} style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#161b22', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>+</button>
            <button onClick={zoomOut} style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#161b22', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>-</button>
            <button onClick={resetZoom} style={{ width: '45px', height: '25px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#161b22', color: '#fff', cursor: 'pointer', fontSize: '10px' }}>Reset</button>
          </div>

          <svg 
            ref={svgRef}
            width="100%" 
            height="100%" 
            viewBox="0 0 1000 680" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <g 
              transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`} 
              style={{ transformOrigin: '500px 340px', transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}
            >
              {/* Proxmox Host Enclosure */}
              <rect 
                x="40" 
                y="240" 
                width="760" 
                height="420" 
                rx="10" 
                fill="none" 
                stroke="#888" 
                strokeWidth="2" 
                strokeDasharray="4,4" 
                style={{ opacity: isFilterActive(['INFRASTRUCTURE']) ? 0.4 : 0.1, transition: 'opacity 0.3s' }} 
              />
              <text 
                x="420" 
                y="262" 
                fill="#888" 
                textAnchor="middle" 
                style={{ fontSize: '12px', fontWeight: 'bold', opacity: isFilterActive(['INFRASTRUCTURE']) ? 0.8 : 0.2, transition: 'opacity 0.3s' }}
              >
                PROXMOX VE HYPERVISOR (HOST server)
              </text>

              {/* Switch to vmbr0 physical trunk line label */}
              <path 
                d="M 770 225 Q 700 280 630 400" 
                fill="none" 
                stroke="#00838f" 
                strokeWidth="2" 
                style={{ opacity: isFilterActive(['INFRASTRUCTURE', 'VLANS']) ? 0.8 : 0.1 }}
              />
              
              {/* vmbr1 Bridge */}
              <g style={{ opacity: isFilterActive(['INFRASTRUCTURE', 'CAPWAP', '802.1X']) ? 1 : 0.15, transition: 'opacity 0.3s' }}>
                <rect x="320" y="280" width="140" height="50" rx="4" fill="#161b22" stroke="#fff" strokeWidth="1.5" />
                <text x="390" y="304" fill="#fff" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 'bold' }}>vmbr1 Bridge</text>
                <text x="390" y="320" fill="#888" textAnchor="middle" style={{ fontSize: '9px' }}>Isolated Internal Network</text>
              </g>

              {/* vmbr0 Bridge */}
              <g style={{ opacity: isFilterActive(['INFRASTRUCTURE', 'VLANS']) ? 1 : 0.15, transition: 'opacity 0.3s' }}>
                <rect x="560" y="400" width="140" height="50" rx="4" fill="#161b22" stroke="#fff" strokeWidth="1.5" />
                <text x="630" y="424" fill="#fff" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 'bold' }}>vmbr0 Bridge</text>
                <text x="630" y="440" fill="#888" textAnchor="middle" style={{ fontSize: '9px' }}>Bridged to Physical NIC</text>
              </g>

              {/* Connections */}
              {wirelessLinks.map((link, i) => {
                const active = isFilterActive(link.filters);
                const start = link.fromCoords || getDevicePos(link.from);
                const end = link.toCoords || getDevicePos(link.to);

                if (link.curved) {
                  const midX = (start.x + end.x) / 2;
                  const offset = link.curveOffset || 100;
                  const midY = Math.min(start.y, end.y) - offset;
                  return (
                    <g key={i} style={{ opacity: active ? 1 : 0.1, transition: 'opacity 0.3s' }}>
                      <path 
                        d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                        stroke={link.color || '#fff'}
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={link.dashed ? '4,4' : 'none'}
                        className={active ? 'pulse-path' : ''}
                      />
                      {link.label && (
                        <text 
                          x={midX} 
                          y={midY - 10} 
                          fill={link.color || '#fff'} 
                          textAnchor="middle" 
                          style={{ fontSize: '10px', fontWeight: 'bold' }}
                        >
                          {link.label}
                        </text>
                      )}
                    </g>
                  );
                }

                return (
                  <g key={i} style={{ opacity: active ? 1 : 0.1, transition: 'opacity 0.3s' }}>
                    <line 
                      x1={start.x} y1={start.y}
                      x2={end.x} y2={end.y}
                      stroke={link.color || '#fff'}
                      strokeWidth="2"
                      strokeDasharray={link.dashed ? '4,4' : 'none'}
                    />
                    {link.label && (
                      <text 
                        x={(start.x + end.x) / 2 + 10} 
                        y={(start.y + end.y) / 2 - 5} 
                        fill={link.color || '#fff'} 
                        style={{ fontSize: '10px', fontWeight: 'bold' }}
                      >
                        {link.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Devices */}
              {wirelessDevices.map((device) => {
                const active = isFilterActive(device.filters);
                const isSelected = selectedDevice?.id === device.id;
                
                // Adjust text placement for VMs/containers to avoid overlaps (bottom of box)
                const isLargeBox = (device.height || 50) > 60;
                const textY = isLargeBox 
                  ? device.y + device.height - 15 
                  : device.y + (device.height || 50) / 2 + 5;

                return (
                  <g 
                    key={device.id}
                    onClick={() => {
                      if (dragged) return;
                      setSelectedDevice(device);
                    }}
                    style={{ cursor: 'pointer', opacity: active ? 1 : 0.2, transition: 'opacity 0.3s' }}
                    className="device-group"
                  >
                    <rect 
                      x={device.x} 
                      y={device.y} 
                      width={device.width || 120} 
                      height={device.height || 50} 
                      rx="6"
                      fill="#0b0e14"
                      stroke={isSelected ? '#fff' : device.color}
                      strokeWidth={isSelected ? '3' : '2'}
                      className="device-rect"
                    />
                    <text 
                      x={device.x + (device.width || 120) / 2} 
                      y={textY} 
                      textAnchor="middle" 
                      fill="#fff" 
                      style={{ fontSize: '12px', fontWeight: 'bold', pointerEvents: 'none' }}
                    >
                      {device.name}
                    </text>
                  </g>
                );
              })}

              {/* Detailed sub-components inside Virtual Machines */}
              {/* WLC VM Inner Details */}
              <g style={{ opacity: isFilterActive(wlc.filters) ? 0.7 : 0.1, pointerEvents: 'none' }} transform="translate(60, 380)">
                {/* Gi1 Interface */}
                <rect x="60" y="25" width="80" height="30" rx="3" fill="#161b22" stroke="#42a5f5" strokeWidth="1" />
                <text x="100" y="43" fill="#ccc" textAnchor="middle" style={{ fontSize: '9px' }}>Gi1 (VLAN XX)</text>
                {/* WLC Engine */}
                <circle cx="100" cy="120" r="30" fill="#161b22" stroke="#42a5f5" strokeWidth="1" />
                <text x="100" y="117" fill="#fff" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 'bold' }}>WLC Engine</text>
                <text x="100" y="130" fill="#888" textAnchor="middle" style={{ fontSize: '8px' }}>Authenticator</text>
              </g>

              {/* FreeRADIUS LXC Container Inner Details */}
              <g style={{ opacity: isFilterActive(radius.filters) ? 0.7 : 0.1, pointerEvents: 'none' }} transform="translate(290, 480)">
                {/* eth0 Interface */}
                <rect x="60" y="25" width="80" height="30" rx="3" fill="#161b22" stroke="#26a69a" strokeWidth="1" />
                <text x="100" y="43" fill="#ccc" textAnchor="middle" style={{ fontSize: '9px' }}>eth0 (vmbr1)</text>
                {/* RADIUS Engine */}
                <circle cx="100" cy="120" r="30" fill="#161b22" stroke="#26a69a" strokeWidth="1" />
                <text x="100" y="117" fill="#fff" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 'bold' }}>RADIUS Engine</text>
                <text x="100" y="130" fill="#888" textAnchor="middle" style={{ fontSize: '8px' }}>Auth Server</text>
              </g>

              {/* OPNsense VM Inner Details */}
              <g style={{ opacity: isFilterActive(opnsense.filters) ? 0.7 : 0.1, pointerEvents: 'none' }} transform="translate(530, 480)">
                {/* vtnet1 (OPT1) */}
                <rect x="20" y="25" width="85" height="30" rx="3" fill="#161b22" stroke="#ef5350" strokeWidth="1" />
                <text x="62.5" y="43" fill="#ccc" textAnchor="middle" style={{ fontSize: '9px' }}>vtnet1 (OPT1)</text>
                {/* vtnet0 (WAN / VLAN) */}
                <rect x="130" y="25" width="95" height="30" rx="3" fill="#161b22" stroke="#ef5350" strokeWidth="1" />
                <text x="177.5" y="43" fill="#ccc" textAnchor="middle" style={{ fontSize: '9px' }}>vtnet0 (Trunks)</text>
                {/* OPT1 Bridge */}
                <circle cx="62.5" cy="120" r="28" fill="#161b22" stroke="#ef5350" strokeWidth="1" />
                <text x="62.5" y="117" fill="#fff" textAnchor="middle" style={{ fontSize: '8px', fontWeight: 'bold' }}>OPT1 Bridge</text>
                <text x="62.5" y="129" fill="#888" textAnchor="middle" style={{ fontSize: '8px' }}>Mgmt GW</text>
                {/* Subnet Gateways */}
                <rect x="130" y="105" width="95" height="35" rx="3" fill="#161b22" stroke="#ef5350" strokeWidth="1" />
                <text x="177.5" y="120" fill="#fff" textAnchor="middle" style={{ fontSize: '8px', fontWeight: 'bold' }}>Subnet Gateways</text>
                <text x="177.5" y="132" fill="#888" textAnchor="middle" style={{ fontSize: '7px' }}>VLANs 100/200/300</text>
              </g>
            </g>
          </svg>
        </div>

        {/* Dynamic labels showing logical pathways */}
        {activeFilter === 'CAPWAP' && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #00acc1', borderRadius: '6px', backgroundColor: 'rgba(0,172,193,0.08)', fontSize: '0.85rem' }}>
            <strong style={{ color: '#00acc1' }}>CAPWAP Traffic Path:</strong> All client data traffic is tunneled inside a CAPWAP wrapper from the Physical AP (over local management networks) directly to the Cisco WLC. The WLC then decapsulates the packets and places them onto their respective client VLANs.
          </div>
        )}
        {activeFilter === '802.1X' && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #26a69a', borderRadius: '6px', backgroundColor: 'rgba(38,166,154,0.08)', fontSize: '0.85rem' }}>
            <strong style={{ color: '#26a69a' }}>802.1X PEAP Authentication:</strong> Client connects to Corporate SSID &rarr; Cisco AP relays 802.1X requests to WLC &rarr; WLC acts as Authenticator and queries FreeRADIUS via RADIUS packets (Access-Request UDP 1812) &rarr; FreeRADIUS validates credentials and replies with Access-Accept.
          </div>
        )}
        {activeFilter === 'PORTAL' && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ef5350', borderRadius: '6px', backgroundColor: 'rgba(239,83,80,0.08)', fontSize: '0.85rem' }}>
            <strong style={{ color: '#ef5350' }}>Captive Portal LWA Loop:</strong> Guest connects to Guest SSID &rarr; Receives IP from OPNsense DHCP &rarr; Guest initiates HTTP web request &rarr; WLC intercept/redirects client to its internal Web Portal login &rarr; validation happens via FreeRADIUS backend &rarr; Firewall rules allow guest out to WAN but block access to Corporate.
          </div>
        )}

        {/* Info Panel */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#161b22',
          borderRadius: '8px',
          border: '1px solid #333',
          minHeight: '150px',
          ...(isFullscreen ? {
            maxHeight: '200px',
            overflowY: 'auto'
          } : {})
        }}>
          {selectedDevice ? (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, color: selectedDevice.color }}>{selectedDevice.name} Configuration</h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#aaa' }}>{selectedDevice.desc}</p>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>Status: Active</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h5 style={{ color: '#888', marginBottom: '10px', fontSize: '0.7rem', textTransform: 'uppercase' }}>Interfaces</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedDevice.interfaces.map((intf, i) => (
                      <div key={i} style={{ backgroundColor: '#0b0e14', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 'bold' }}>{intf.name}</span>
                          <span style={{ color: selectedDevice.color }}>{intf.ip}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{intf.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 style={{ color: '#888', marginBottom: '10px', fontSize: '0.7rem', textTransform: 'uppercase' }}>Config / Lab Parameters</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedDevice.config.map((c, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', padding: '4px 10px', borderLeft: '2px solid #333', color: '#ccc' }}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666', textAlign: 'center', minHeight: '110px' }}>
              <p>Select a node or apply a layer filter above to inspect the Proxmox and physical wireless networking lab topology.</p>
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

const wlc = wirelessDevices[4];
const radius = wirelessDevices[5];
const opnsense = wirelessDevices[6];
