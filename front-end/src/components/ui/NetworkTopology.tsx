"use client";

interface NetworkTopologyProps {
  type: "enterprise" | "mpls";
}

export default function NetworkTopology({ type }: NetworkTopologyProps) {
  return (
    <div
      className="topology-container"
      style={{
        marginTop: "20px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {type === "enterprise" ? (
        <div style={{ textAlign: "center" }}>
          <div className="network-node pulse">ISP</div>
          <div className="network-line"></div>
          <div
            className="network-node pulse"
            style={{ backgroundColor: "var(--node-blue)" }}
          >
            EDGE
          </div>
          <div className="network-line"></div>
          <div
            className="network-node pulse"
            style={{ backgroundColor: "var(--node-magenta)" }}
          >
            CORE
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="network-node" style={{ backgroundColor: "var(--node-dark)" }}>
            CE
          </div>
          <div className="network-line-horizontal pulse-line"></div>
          <div className="network-node" style={{ backgroundColor: "var(--node-blue)" }}>
            PE
          </div>
          <div className="network-line-horizontal pulse-line"></div>
          <div className="network-node" style={{ backgroundColor: "var(--node-magenta)" }}>
            P-Core
          </div>
          <div className="network-line-horizontal pulse-line"></div>
          <div className="network-node" style={{ backgroundColor: "var(--node-blue)" }}>
            PE
          </div>
          <div className="network-line-horizontal pulse-line"></div>
          <div className="network-node" style={{ backgroundColor: "var(--node-dark)" }}>
            CE
          </div>
        </div>
      )}

      <style jsx>{`
        .network-node {
          width: 60px;
          height: 40px;
          background-color: var(--node-dark);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        .network-line {
          width: 2px;
          height: 20px;
          background-color: var(--border-color);
          margin: 0 auto;
        }
        .network-line-horizontal {
          width: 30px;
          height: 2px;
          background-color: var(--border-color);
        }
        .pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 var(--text-light);
          }
          70% {
            box-shadow: 0 0 0 10px transparent;
          }
          100% {
            box-shadow: 0 0 0 0 transparent;
          }
        }
        .pulse-line {
          animation: pulseLine 1.5s infinite;
        }
        @keyframes pulseLine {
          0% {
            background-color: var(--border-color);
          }
          50% {
            background-color: var(--node-blue);
          }
          100% {
            background-color: var(--border-color);
          }
        }
      `}</style>
    </div>
  );
}
