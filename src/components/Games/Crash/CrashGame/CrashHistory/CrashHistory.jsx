import React from "react";

/**
 * CrashHistory.jsx
 * Use inside your CustomModal body: <CrashHistory />
 */

const sampleRows = [
  { id: "1", time: "12:32 AM 11/25/2025", multiplier: "10.05", highlight: false },
  { id: "2", time: "12:31 AM 11/25/2025", multiplier: "2.05", highlight: true },
  { id: "3", time: "12:31 AM 11/25/2025", multiplier: "10.05", highlight: false },
  { id: "4", time: "12:30 AM 11/25/2025", multiplier: "2.05", highlight: false },
  { id: "5", time: "12:30 AM 11/25/2025", multiplier: "10.05", highlight: false },
  { id: "6", time: "12:30 AM 11/25/2025", multiplier: "2.05", highlight: false },
  { id: "7", time: "12:30 AM 11/25/2025", multiplier: "10.05", highlight: false },
  { id: "8", time: "12:30 AM 11/25/2025", multiplier: "2.05", highlight: true },
  { id: "9", time: "12:30 AM 11/25/2025", multiplier: "10.05", highlight: false },
  { id: "10", time: "12:30 AM 11/25/2025", multiplier: "2.05", highlight: false },
];

const Header = () => (
  <div
    className="grid grid-cols-[1fr_160px_80px] items-center px-4 pb-4 sticky top-0 z-20"
    style={{ background: "transparent" }}
  >
    <div className="text-sm1 font-semibold font-InstrumentSansSemiBold" style={{ color: "#9fb2b8" }}>
      Time
    </div>
    <div className="text-sm1 font-semibold font-InstrumentSansSemiBold" style={{ color: "#9fb2b8" }}>
      Multiplier
    </div>
    <div className="text-sm1 font-semibold font-InstrumentSansSemiBold" style={{ color: "#9fb2b8" }}>
      Details
    </div>
  </div>
);

const Row = ({ row, index }) => {
  return (
    <div className="px-4">
      <div className="flex items-center justify-between gap-4 p-4 rounded-lg" 
      style={{
        background: index % 2 ==0 ? "#223440" : ""
      }}
      >
        {/* Time */}
        <div className="flex-1">
          <div style={{ color: "#9fb2b8", fontSize: 15 }}>
            {row.time}
          </div>
        </div>

        {/* Multiplier */}
        <div style={{ width: 160 }} className="flex justify-center">
          <div style={{ paddingLeft: 12, paddingRight: 12 }}>
            <span
              style={{
                color: row.highlight ? "#F5F15A" : "#cfe6ea",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {row.multiplier}
            </span>
            <span style={{ color: "#9fb2b8", marginLeft: 6, fontSize: 12 }}>×</span>
          </div>
        </div>

        {/* Details */}
        <div style={{ width: 80 }} className="text-right">
          <button
            style={{ color: "#9fb2b8", fontWeight: 600, fontSize: 15 }}
            onClick={() => {}}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CrashHistory({ rows = sampleRows }) {
  return (
    <div className="w-full">
      <Header />

      <div
        className="mt-4 space-y-4 hide-scrollbar"
        style={{
          maxHeight: "58vh",
          overflowY: "auto",
          paddingBottom: 8,
        }}
      >
        {rows.map((r, i) => (
          <Row key={r.id} row={r} index={i} />
        ))}

        <div className="h-6" />
      </div>
    </div>
  );
}
