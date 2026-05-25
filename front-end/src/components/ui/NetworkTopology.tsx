'use client';

interface NetworkTopologyProps {
  type: 'enterprise' | 'mpls';
}

export default function NetworkTopology({ type }: NetworkTopologyProps) {
  return (
    <div className="topology-container" style={{ marginTop: "20px", display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
      {type === 'enterprise' ? (
        <div style={{ textAlign: "center" }}>
          <div className="network-node pulse">ISP</div>
          <div className="network-line"></div>
          <div className="network-node pulse" style={{ backgroundColor: "#0070f3" }}>EDGE</div>
          <div className="network-line"></div>
          <div className="network-node pulse" style={{ backgroundColor: "#ff0080" }}>CORE</div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="network-node" style={{ backgroundColor: "#444" }}>CE</div>
          <div className="network-line-horizontal pulse-line"></div>
          <div className="network-node" style={{ backgroundColor: "#0070f3" }}>PE</div>
          <div className="network-line-horizontal pulse-line"></div>
          <div className="network-node" style={{ backgroundColor: "#ff0080" }}>P-Core</div>
          <div className="network-line-horizontal pulse-line"></div>
          <div className="network-node" style={{ backgroundColor: "#0070f3" }}>PE</div>
          <div className="network-line-horizontal pulse-line"></div>
          <div className="network-node" style={{ backgroundColor: "#444" }}>CE</div>
        </div>
      )}

      <style jsx>{`
        .network-node {
          width: 60px;
          height: 40px;
          background-color: #333;
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
          background-color: #ccc;
          margin: 0 auto;
        }
        .network-line-horizontal {
          width: 30px;
          height: 2px;
          background-color: #ccc;
        }
        .pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0,0,0, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(0,0,0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0,0,0, 0); }
        }
        .pulse-line {
          animation: pulseLine 1.5s infinite;
        }
        @keyframes pulseLine {
          0% { background-color: #ccc; }
          50% { background-color: #0070f3; }
          100% { background-color: #ccc; }
        }
      `}</style>
    </div>
  );
}
