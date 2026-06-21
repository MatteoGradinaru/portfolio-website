export type WirelessFilter =
  | "ALL"
  | "INFRASTRUCTURE"
  | "VLANS"
  | "CAPWAP"
  | "802.1X"
  | "PORTAL";

export interface WirelessDevice {
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

export interface WirelessLink {
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

export const wirelessDevices: WirelessDevice[] = [
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

export const wirelessLinks: WirelessLink[] = [
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

export const getLinkLabelCoords = (id: string) => {
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
