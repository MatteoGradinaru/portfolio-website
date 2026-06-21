export interface NodeInfo {
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

export const infrastructureNodes: NodeInfo[] = [
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
      "@Profile(\"staging\")",
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
      "@Profile(\"production\")",
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
