'use client';

import { useState, useEffect, useRef } from 'react';

interface NodeInfo {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  details: string;
  commandsOrCode: string[];
}

export default function FiretruckExplorer() {
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
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
          setScale((prev) => Math.min(prev + zoomFactor, 2));
        } else {
          setScale((prev) => Math.max(prev - zoomFactor, 0.6));
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

  // Node details for Infrastructure diagram
  const infrastructureNodes: NodeInfo[] = [
    {
      id: 'github',
      name: 'GitHub Repository',
      role: 'Source Control',
      x: 100,
      y: 80,
      width: 150,
      height: 50,
      color: '#7f8c8d',
      details: 'Git repository containing the source code for the Next.js frontend, Spring Boot backend, database configurations, and OKD deployment manifests. Pushing to the main branch targets development, while pushing git tags targets production.',
      commandsOrCode: [
        '# Deploy changes to development environment',
        'git push origin main',
        '',
        '# Deploy changes to production environment',
        'git tag -a v1.2.0 -m "Release v1.2.0"',
        'git push origin v1.2.0'
      ]
    },
    {
      id: 'actions',
      name: 'GitHub Actions',
      role: 'CI/CD Pipelines',
      x: 100,
      y: 220,
      width: 150,
      height: 60,
      color: '#3498db',
      details: 'Runs the automated CI/CD pipeline. The CI steps (compiling, code quality linting, testing) are identical in all runs. The CD deployment changes based on the git ref: a main branch push builds and deploys to the OKD Development namespace, while a version tag push (v*) builds and deploys to the OKD Production namespace.',
      commandsOrCode: [
        'on:',
        '  push:',
        '    branches: [ main ]',
        '    tags: [ "v*" ]',
        '',
        'jobs:',
        '  ci_pipeline: # Identical for both triggers',
        '    runs-on: ubuntu-latest',
        '    steps:',
        '      - uses: actions/checkout@v3',
        '      - name: Build and test application',
        '        run: mvn clean test',
        '',
        '  cd_pipeline: # Routes deployment target',
        '    runs-on: ubuntu-latest',
        '    steps:',
        '      - name: Deploy to OKD Production Namespace',
        '        if: startsWith(github.ref, \'refs/tags/\')',
        '        run: oc apply -f k8s/production/',
        '      - name: Deploy to OKD Development Namespace',
        '        if: "!startsWith(github.ref, \'refs/tags/\')"',
        '        run: oc apply -f k8s/development/'
      ]
    },
    {
      id: 'esp32',
      name: 'ESP32 Firetruck',
      role: 'IoT Client Node',
      x: 100,
      y: 400,
      width: 150,
      height: 60,
      color: '#e67e22',
      details: 'Physical firetruck robot featuring flame phototransistors to determine fire direction and a water sensor in the tank. The ESP32 client establishes a persistent connection and streams sensor data over WebSockets in real time.',
      commandsOrCode: [
        '// Telemetry payload format sent from ESP32',
        '{',
        '  "device_id": "esp32_firetruck_01",',
        '  "sensors": {',
        '    "flame_detected": true,',
        '    "water_level_pct": 82',
        '  },',
        '  "status": "EXTINGUISHING"',
        '}'
      ]
    },
    {
      id: 'opnsense',
      name: 'OPNsense Firewall',
      role: 'Network Gateway',
      x: 290,
      y: 400,
      width: 150,
      height: 60,
      color: '#1abc9c',
      details: 'OPNsense gateway securing the environment. The ESP32 is locked into an isolated IoT VLAN/SSID. The firewall allows outbound WebSocket connections to the OKD cluster but blocks inbound connections to protect the embedded system.',
      commandsOrCode: [
        'Rule: PASS IoT_VLAN to OKD_Cluster Port 443',
        'Rule: BLOCK WAN to IoT_VLAN',
        'Rule: BLOCK IoT_VLAN to Local_Corporate_VLAN'
      ]
    },
    {
      id: 'dev_ingress',
      name: 'Dev Ingress',
      role: 'OKD Router',
      x: 570,
      y: 100,
      width: 110,
      height: 40,
      color: '#95a5a6',
      details: 'Development ingress route in OKD. Routes developer web requests to the development environment frontend/backend pods and proxies WebSocket connections.',
      commandsOrCode: [
        'apiVersion: route.openshift.io/v1',
        'kind: Route',
        'metadata:',
        '  name: dev-route',
        'spec:',
        '  host: dev.ucll-portfolio.be'
      ]
    },
    {
      id: 'dev_frontend',
      name: 'Dev Frontend',
      role: 'Next.js Pod',
      x: 570,
      y: 180,
      width: 110,
      height: 40,
      color: '#34495e',
      details: 'Development Next.js application container pod serving the dev dashboard layout, letting developers view debug metrics and logs.',
      commandsOrCode: [
        'environment: DEVELOPMENT',
        'replicas: 1'
      ]
    },
    {
      id: 'dev_backend',
      name: 'Dev Backend',
      role: 'Spring Boot Pod',
      x: 720,
      y: 100,
      width: 110,
      height: 40,
      color: '#2ecc71',
      details: 'Development Spring Boot backend pod. Receives WebSocket data streams from the firetruck, processes the metrics, stores data in the dev database, and broadcasts updates to dev clients.',
      commandsOrCode: [
        '@Profile("development")',
        '@Component',
        'public class DevTelemetryHandler { ... }'
      ]
    },
    {
      id: 'dev_db',
      name: 'Dev Database',
      role: 'Database Pod',
      x: 870,
      y: 100,
      width: 110,
      height: 40,
      color: '#9b59b6',
      details: 'Isolated development database storing test run records, allowing developers to inspect data payloads during local test runs.',
      commandsOrCode: [
        'database: h2-in-memory',
        'connection-url: jdbc:h2:mem:devdb'
      ]
    },
    {
      id: 'prod_ingress',
      name: 'Prod Ingress',
      role: 'OKD Router',
      x: 570,
      y: 300,
      width: 110,
      height: 40,
      color: '#e74c3c',
      details: 'Production ingress route in OKD. Routes live production domain traffic to the frontend and backend production pods, ensuring secure TLS/SSL termination and reliable WebSocket connections.',
      commandsOrCode: [
        'apiVersion: route.openshift.io/v1',
        'kind: Route',
        'metadata:',
        '  name: prod-route',
        'spec:',
        '  host: firetruck.ucll-portfolio.be',
        '  tls:',
        '    termination: edge'
      ]
    },
    {
      id: 'prod_frontend',
      name: 'Prod Frontend',
      role: 'Next.js Pod',
      x: 570,
      y: 380,
      width: 110,
      height: 40,
      color: '#34495e',
      details: 'Production Next.js application frontend. Subscribes to the production backend WebSocket topic to display live system status and historical telemetry logs.',
      commandsOrCode: [
        'environment: PRODUCTION',
        'replicas: 2',
        'strategy: RollingUpdate'
      ]
    },
    {
      id: 'prod_backend',
      name: 'Prod Backend',
      role: 'Spring Boot Pod',
      x: 720,
      y: 300,
      width: 110,
      height: 40,
      color: '#2ecc71',
      details: 'Production Spring Boot application pod. Integrates the WebSocket message broker endpoint. Receives live C++ ESP32 client data packets, persists logs to the PostgreSQL production database, and publishes updates to the dashboard topic.',
      commandsOrCode: [
        '@Profile("production")',
        '@Service',
        'public class ProductionTelemetryBroker {',
        '  // Saves logs to PostgreSQL',
        '  // Broadcasts to /topic/live',
        '}'
      ]
    },
    {
      id: 'prod_db',
      name: 'Prod Database',
      role: 'Database Pod',
      x: 870,
      y: 300,
      width: 110,
      height: 40,
      color: '#9b59b6',
      details: 'Persistent production database storing the official telemetry data history, flame sensor records, and water level changes.',
      commandsOrCode: [
        'database: postgresql',
        'connection-url: jdbc:postgresql://db:5432/prod'
      ]
    }
  ];

  // Drag and Pan handlers for Infrastructure SVG
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.15, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.6));
  const resetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div style={{
      marginTop: isFullscreen ? '0px' : '20px',
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
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #333',
        backgroundColor: '#161b22',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px'
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Deployment & Data Flow Topology</span>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            padding: "6px 12px",
            border: "1px solid #444",
            borderRadius: "4px",
            backgroundColor: "#1f242c",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
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
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '15px' }}>
          Interactive Deployment & Data Flow Architecture Map. Click on any node to view integration pipeline implementation details and configuration files.
        </p>

        <div style={{
          position: 'relative',
          width: '100%',
          height: isFullscreen ? 'calc(100vh - 350px)' : '480px',
          backgroundColor: '#0b0e14',
          borderRadius: '8px',
          border: '1px solid #333',
          overflow: 'hidden',
          ...(isFullscreen ? { flex: 1, minHeight: '250px' } : {})
        }}>
          
          {/* Zoom Controls */}
          <div style={{ position: 'absolute', right: '15px', bottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 10 }}>
            <button onClick={zoomIn} style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#161b22', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>+</button>
            <button onClick={zoomOut} style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#161b22', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>-</button>
            <button onClick={resetZoom} style={{ width: '45px', height: '25px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#161b22', color: '#fff', cursor: 'pointer', fontSize: '10px' }}>Reset</button>
          </div>

          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 1000 480"
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
              style={{ transformOrigin: '500px 240px', transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}
            >
              {/* OKD K8s Cluster Boundary Enclosure */}
              <rect
                x="480"
                y="30"
                width="500"
                height="420"
                rx="10"
                fill="none"
                stroke="#555"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <text x="730" y="50" fill="#888" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
                OKD / KUBERNETES CONTAINER CLUSTER
              </text>

              {/* Dev Environment Boundary Enclosure */}
              <rect
                x="500"
                y="60"
                width="460"
                height="170"
                rx="6"
                fill="none"
                stroke="#333"
                strokeWidth="1.5"
              />
              <text x="515" y="80" fill="#888" textAnchor="start" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                DEVELOPMENT ENVIRONMENT (main branch push)
              </text>

              {/* Prod Environment Boundary Enclosure */}
              <rect
                x="500"
                y="260"
                width="460"
                height="170"
                rx="6"
                fill="none"
                stroke="#d32f2f"
                strokeWidth="1.5"
                style={{ opacity: 0.7 }}
              />
              <text x="515" y="280" fill="#e74c3c" textAnchor="start" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                PRODUCTION ENVIRONMENT (tag push v*)
              </text>

              {/* Git Repository to actions connector */}
              <path d="M 100 105 L 100 190" fill="none" stroke="#666" strokeWidth="2" strokeDasharray="3,3" />

              {/* Github Actions to Dev Ingress Route */}
              <path d="M 175 210 Q 330 180 515 110" fill="none" stroke="#3498db" strokeWidth="2" />
              <text x="320" y="150" fill="#3498db" style={{ fontSize: '9px', fontWeight: 'bold' }}>Push main -{'>'} Deploy Dev</text>

              {/* Github Actions to Prod Ingress Route */}
              <path d="M 175 230 Q 330 280 515 310" fill="none" stroke="#e74c3c" strokeWidth="2" />
              <text x="320" y="280" fill="#e74c3c" style={{ fontSize: '9px', fontWeight: 'bold' }}>Push tag v* -{'>'} Deploy Prod</text>

              {/* ESP32 to Router Link */}
              <path d="M 175 400 L 215 400" fill="none" stroke="#e67e22" strokeWidth="2" strokeDasharray="2,2" />
              <text x="195" y="390" fill="#e67e22" textAnchor="middle" style={{ fontSize: '8px', fontWeight: 'bold' }}>Wi-Fi</text>

              {/* OPNsense to Ingress Routing (Websocket connections) */}
              {/* To Dev Backend WebSockets */}
              <path d="M 365 370 Q 440 230 515 120" fill="none" stroke="#1abc9c" strokeWidth="1.5" strokeDasharray="3,3" />
              {/* To Prod Backend WebSockets */}
              <path d="M 365 400 Q 450 380 515 320" fill="none" stroke="#1abc9c" strokeWidth="2" />
              <text x="430" y="350" fill="#1abc9c" style={{ fontSize: '9px', fontWeight: 'bold' }}>WebSocket Stream</text>

              {/* Internal Dev connections */}
              <path d="M 625 100 L 665 100" fill="none" stroke="#95a5a6" strokeWidth="1.5" />
              <path d="M 570 120 L 570 160" fill="none" stroke="#95a5a6" strokeWidth="1.5" />
              <path d="M 775 100 L 815 100" fill="none" stroke="#95a5a6" strokeWidth="1.5" />
              <path d="M 720 120 Q 645 150 625 180" fill="none" stroke="#2ecc71" strokeWidth="1.5" strokeDasharray="2,2" />
              <text x="690" y="155" fill="#2ecc71" style={{ fontSize: '7.5px' }}>WebSocket Broker</text>

              {/* Internal Prod connections */}
              <path d="M 625 300 L 665 300" fill="none" stroke="#e74c3c" strokeWidth="1.5" />
              <path d="M 570 320 L 570 360" fill="none" stroke="#e74c3c" strokeWidth="1.5" />
              <path d="M 775 300 L 815 300" fill="none" stroke="#e74c3c" strokeWidth="1.5" />
              <path d="M 720 320 Q 645 350 625 380" fill="none" stroke="#2ecc71" strokeWidth="1.5" strokeDasharray="2,2" />
              <text x="690" y="355" fill="#2ecc71" style={{ fontSize: '7.5px' }}>WebSocket Broker</text>

              {/* Render Nodes */}
              {infrastructureNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Box Shape */}
                    <rect
                      x={-node.width / 2}
                      y={-node.height / 2}
                      width={node.width}
                      height={node.height}
                      rx="6"
                      fill="#161b22"
                      stroke={isSelected ? '#fff' : node.color}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      style={{
                        transition: 'all 0.2s',
                        filter: isSelected ? `drop-shadow(0 0 6px ${node.color})` : 'none'
                      }}
                    />
                    {/* Title */}
                    <text
                      x="0"
                      y="-4"
                      fill="#fff"
                      textAnchor="middle"
                      style={{ fontSize: '11px', fontWeight: 'bold' }}
                    >
                      {node.name}
                    </text>
                    {/* Subtitle */}
                    <text
                      x="0"
                      y="12"
                      fill="#888"
                      textAnchor="middle"
                      style={{ fontSize: '8.5px' }}
                    >
                      {node.role}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Details Panel below SVG Map */}
        <div
          style={{
            marginTop: '15px',
            minHeight: '140px',
            padding: '16px',
            backgroundColor: '#161b22',
            borderRadius: '8px',
            border: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            ...(isFullscreen ? {
              maxHeight: '200px',
              overflowY: 'auto'
            } : {})
          }}
        >
          {selectedNode ? (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 350px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      backgroundColor: selectedNode.color,
                      display: 'inline-block'
                    }}
                  ></span>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>{selectedNode.name} ({selectedNode.role})</h4>
                </div>
                <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#ccc', lineHeight: '1.5' }}>
                  {selectedNode.details}
                </p>
              </div>

              <div style={{ flex: '1 1 250px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', display: 'block', marginBottom: '6px' }}>
                  INTEGRATION IMPLEMENTATION:
                </span>
                <pre
                  style={{
                    margin: 0,
                    padding: '10px',
                    backgroundColor: '#0b0e14',
                    border: '1px solid #222',
                    borderRadius: '4px',
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '0.75rem',
                    color: '#ddd',
                    overflowX: 'auto',
                    maxHeight: '150px'
                  }}
                >
                  {selectedNode.commandsOrCode.join('\n')}
                </pre>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#666', fontSize: '0.9rem' }}>
              Click on any node in the architecture map above to inspect the integration pipeline, firmware protocols, and OKD configurations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
