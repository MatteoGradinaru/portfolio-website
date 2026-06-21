"use client";

import { useState, useEffect, useRef } from "react";

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
      id: "github",
      name: "GitHub Repository",
      role: "Source Control",
      x: 100,
      y: 80,
      width: 150,
      height: 50,
      color: "#a07cf8",
      details:
        "Git repository containing the source code for the Next.js frontend, Spring Boot backend, database configurations, and OKD deployment manifests. Pushing to the main branch targets staging, while pushing git tags targets production.",
      commandsOrCode: [
        "# Deploy changes to staging environment",
        "git push origin main",
        "",
        "# Deploy changes to production environment",
        'git tag -a v1.2.0 -m "Release v1.2.0"',
        "git push origin v1.2.0",
      ],
    },
    {
      id: "actions",
      name: "GitHub Actions",
      role: "CI/CD Pipelines",
      x: 100,
      y: 220,
      width: 150,
      height: 60,
      color: "#00e5ff",
      details:
        "Runs the automated CI/CD pipeline. The CI steps compile the Java/React code and run tests. If tests pass, a Docker image is built and pushed to the GitHub Container Registry (GHCR). A main branch push deploys to the OKD Staging namespace, while a version tag push (v*) deploys to the OKD Production namespace.",
      commandsOrCode: [
        "on:",
        "  push:",
        "    branches: [ main ]",
        '    tags: [ "v*" ]',
        "",
        "jobs:",
        "  ci_pipeline: # Identical for both triggers",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - uses: actions/checkout@v3",
        "      - name: Build and test application",
        "        run: mvn clean test",
        "",
        "  cd_pipeline: # Routes deployment target",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - name: Deploy to OKD Production Namespace",
        "        if: startsWith(github.ref, 'refs/tags/')",
        "        run: oc apply -f k8s/production/",
        "      - name: Deploy to OKD Staging Namespace",
        "        if: \"!startsWith(github.ref, 'refs/tags/')\"",
        "        run: oc apply -f k8s/staging/",
      ],
    },
    {
      id: "esp32",
      name: "ESP32 Firetruck",
      role: "IoT Client Node",
      x: 100,
      y: 400,
      width: 150,
      height: 60,
      color: "#ffab40",
      details:
        "Physical firetruck robot featuring flame phototransistors to determine fire direction and a water sensor in the tank. Streams sensor data over WebSockets (STOMP protocol) in real time. Authenticates using a security token and X-Device-ID in headers, and transmits heartbeats to prove it is alive (marked offline if inactive for 30s).",
      commandsOrCode: [
        "// Telemetry payload format sent from ESP32",
        "{",
        '  "device_id": "esp32_firetruck_01",',
        '  "sensors": {',
        '    "flame_detected": true,',
        '    "water_level_pct": 82',
        "  },",
        '  "status": "EXTINGUISHING"',
        "}",
      ],
    },
    {
      id: "dev_ingress",
      name: "Staging Ingress",
      role: "OKD Router",
      x: 570,
      y: 100,
      width: 110,
      height: 40,
      color: "#00e5ff",
      details:
        "Staging ingress route in OKD. An Ingress acts as the entry point (reverse proxy) for external traffic entering the cluster. It routes client web requests and ESP32 WebSocket connections to the staging frontend and backend pods.",
      commandsOrCode: [
        "apiVersion: route.openshift.io/v1",
        "kind: Route",
        "metadata:",
        "  name: staging-route",
        "spec:",
        "  host: staging.ucll-portfolio.be",
      ],
    },
    {
      id: "dev_frontend",
      name: "Staging Frontend",
      role: "Next.js Pod",
      x: 570,
      y: 180,
      width: 110,
      height: 40,
      color: "#a07cf8",
      details:
        "Staging Next.js application container pod serving the dashboard layout, letting users view live metrics and logs. Utilizes the custom useWebSocket.ts hook to stay persistently connected to the backend.",
      commandsOrCode: ["environment: STAGING", "replicas: 1"],
    },
    {
      id: "dev_backend",
      name: "Staging Backend",
      role: "Spring Boot Pod",
      x: 720,
      y: 100,
      width: 110,
      height: 40,
      color: "#00b0ff",
      details:
        "Staging Spring Boot backend pod. Receives WebSocket STOMP streams from the firetruck, processes the metrics, stores data in the staging database, and pushes updates directly to the staging frontend client. API versioning starts with /v1/.",
      commandsOrCode: [
        '@Profile("staging")',
        "@Component",
        "public class StagingTelemetryHandler { ... }",
      ],
    },
    {
      id: "dev_db",
      name: "Staging Database",
      role: "Database Pod",
      x: 870,
      y: 100,
      width: 110,
      height: 40,
      color: "#1de9b6",
      details:
        "Staging database storing test run records. Automatically managed and migrated by Flyway upon backend startup.",
      commandsOrCode: ["database: postgresql-staging", "migrations: flyway"],
    },
    {
      id: "prod_ingress",
      name: "Prod Ingress",
      role: "OKD Router",
      x: 570,
      y: 300,
      width: 110,
      height: 40,
      color: "#ff1744",
      details:
        "Production ingress route in OKD. Exposes the cluster to external internet traffic, providing secure TLS termination and routing live web dashboard requests and ESP32 WebSocket streams to the production frontend and backend pods.",
      commandsOrCode: [
        "apiVersion: route.openshift.io/v1",
        "kind: Route",
        "metadata:",
        "  name: prod-route",
        "spec:",
        "  host: firetruck.ucll-portfolio.be",
        "  tls:",
        "    termination: edge",
      ],
    },
    {
      id: "prod_frontend",
      name: "Prod Frontend",
      role: "Next.js Pod",
      x: 570,
      y: 380,
      width: 110,
      height: 40,
      color: "#a07cf8",
      details:
        "Production Next.js application frontend. Subscribes to the production backend STOMP topic using useWebSocket.ts to display live system status and historical telemetry logs.",
      commandsOrCode: [
        "environment: PRODUCTION",
        "replicas: 2",
        "strategy: RollingUpdate",
      ],
    },
    {
      id: "prod_backend",
      name: "Prod Backend",
      role: "Spring Boot Pod",
      x: 720,
      y: 300,
      width: 110,
      height: 40,
      color: "#00b0ff",
      details:
        "Production Spring Boot application pod. Integrates the STOMP WebSocket endpoint. Receives live telemetry from the ESP32 firetruck, persists logs to the PostgreSQL production database, and pushes real-time updates directly to the frontend clients.",
      commandsOrCode: [
        '@Profile("production")',
        "@Service",
        "public class ProductionTelemetryHandler {",
        "  // Saves logs to PostgreSQL",
        "  // Broadcasts updates via STOMP",
        "}",
      ],
    },
    {
      id: "prod_db",
      name: "Prod Database",
      role: "Database Pod",
      x: 870,
      y: 300,
      width: 110,
      height: 40,
      color: "#1de9b6",
      details:
        "Production PostgreSQL database storing the official telemetry data history, flame sensor logs, and water levels. Automatically managed and migrated by Flyway upon backend startup.",
      commandsOrCode: ["database: postgresql", "migrations: flyway"],
    },
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
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.15, 2));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.6));
  const resetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        marginTop: isFullscreen ? "0px" : "20px",
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
          Deployment Topology
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
        <div
          style={{
            position: "relative",
            width: "100%",
            height: isFullscreen ? "calc(100vh - 350px)" : "480px",
            backgroundColor: "#0b0e14",
            borderRadius: "8px",
            border: "1px solid #333",
            overflow: "hidden",
            ...(isFullscreen ? { flex: 1, minHeight: "250px" } : {}),
          }}
        >
          {/* Zoom Controls */}
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
            viewBox="0 0 1000 480"
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
                transformOrigin: "500px 240px",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
            >
              {/* OKD K8s Cluster Boundary Enclosure */}
              <rect
                x="480"
                y="30"
                width="500"
                height="420"
                rx="10"
                fill="none"
                stroke="#888"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <text
                x="730"
                y="22"
                fill="#e2e8f0"
                textAnchor="middle"
                style={{
                  fontSize: "11.5px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
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
                stroke="#555"
                strokeWidth="1.5"
              />
              <text
                x="515"
                y="52"
                fill="#00e5ff"
                textAnchor="start"
                style={{ fontSize: "10.5px", fontWeight: "bold" }}
              >
                STAGING ENVIRONMENT
              </text>

              {/* Prod Environment Boundary Enclosure */}
              <rect
                x="500"
                y="260"
                width="460"
                height="170"
                rx="6"
                fill="none"
                stroke="#ff1744"
                strokeWidth="1.5"
                style={{ opacity: 0.7 }}
              />
              <text
                x="515"
                y="252"
                fill="#ff5252"
                textAnchor="start"
                style={{ fontSize: "10.5px", fontWeight: "bold" }}
              >
                PRODUCTION ENVIRONMENT
              </text>

              {/* Git Repository to actions connector */}
              <path
                d="M 100 105 L 100 190"
                fill="none"
                stroke="#8b949e"
                strokeWidth="2"
                strokeDasharray="3,3"
              />

              {/* Github Actions to Dev Ingress Route */}
              <path
                d="M 175 210 Q 330 180 515 110"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2"
              />
              <text
                x="210"
                y="145"
                fill="#00e5ff"
                style={{ fontSize: "11px", fontWeight: "bold" }}
              >
                Push main {"=>"} Deploy Staging
              </text>

              {/* Github Actions to Prod Ingress Route */}
              <path
                d="M 175 230 Q 330 280 515 310"
                fill="none"
                stroke="#ff1744"
                strokeWidth="2"
              />
              <text
                x="210"
                y="235"
                fill="#ff5252"
                style={{ fontSize: "11px", fontWeight: "bold" }}
              >
                Push tag v* {"=>"} Deploy Production
              </text>

              {/* ESP32 WebSockets to OKD Ingress Router (via Wi-Fi/Internet) */}
              {/* To Staging Ingress */}
              <path
                d="M 175 390 Q 400 320 515 100"
                fill="none"
                stroke="#00b0ff"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              {/* To Prod Ingress */}
              <path
                d="M 175 410 Q 330 360 515 300"
                fill="none"
                stroke="#00b0ff"
                strokeWidth="2"
              />
              <text
                x="300"
                y="385"
                fill="#00e5ff"
                style={{ fontSize: "11px", fontWeight: "bold" }}
              >
                WebSocket Stream (STOMP)
              </text>

              {/* Internal Dev connections */}
              <path
                d="M 625 100 L 665 100"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="1.5"
              />
              <path
                d="M 570 120 L 570 160"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="1.5"
              />
              <path
                d="M 775 100 L 815 100"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="1.5"
              />
              <path
                d="M 720 120 Q 645 150 625 180"
                fill="none"
                stroke="#00b0ff"
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              <text
                x="690"
                y="155"
                fill="#00e5ff"
                style={{ fontSize: "9.5px", fontWeight: "bold" }}
              >
                STOMP Push
              </text>

              {/* Internal Prod connections */}
              <path
                d="M 625 300 L 665 300"
                fill="none"
                stroke="#ff1744"
                strokeWidth="1.5"
              />
              <path
                d="M 570 320 L 570 360"
                fill="none"
                stroke="#ff1744"
                strokeWidth="1.5"
              />
              <path
                d="M 775 300 L 815 300"
                fill="none"
                stroke="#ff1744"
                strokeWidth="1.5"
              />
              <path
                d="M 720 320 Q 645 350 625 380"
                fill="none"
                stroke="#00b0ff"
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              <text
                x="690"
                y="355"
                fill="#00e5ff"
                style={{ fontSize: "9.5px", fontWeight: "bold" }}
              >
                STOMP Push
              </text>

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
                    style={{ cursor: "pointer" }}
                  >
                    {/* Box Shape */}
                    <rect
                      x={-node.width / 2}
                      y={-node.height / 2}
                      width={node.width}
                      height={node.height}
                      rx="6"
                      fill="#161b22"
                      stroke={isSelected ? "#fff" : node.color}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      style={{
                        transition: "all 0.2s",
                      }}
                    />
                    {/* Title */}
                    <text
                      x="0"
                      y="-4"
                      fill="#fff"
                      textAnchor="middle"
                      style={{ fontSize: "11px", fontWeight: "bold" }}
                    >
                      {node.name}
                    </text>
                    {/* Subtitle */}
                    <text
                      x="0"
                      y="12"
                      fill="#cbd5e1"
                      textAnchor="middle"
                      style={{ fontSize: "8.5px" }}
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
          {selectedNode ? (
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: "1.05rem", color: selectedNode.color, fontWeight: "bold" }}>
                  {selectedNode.name} ({selectedNode.role})
                </h4>
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "0.85rem",
                    color: "#ccc",
                    lineHeight: "1.5",
                  }}
                >
                  {selectedNode.details}
                </p>
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
              Click on any node in the architecture map above to inspect the
              integration pipeline, firmware protocols, and OKD configurations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
