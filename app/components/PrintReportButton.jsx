"use client";

export default function PrintReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print-report-button"
    >
      Print / Save PDF
    </button>
  );
}
