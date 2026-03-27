"use client";

/**
 * TimeAllocationChart
 * --------------------
 * Doughnut chart showing done vs remaining time (in minutes)
 * for the currently selected day.
 *
 * Props:
 *  - doneMinutes      number  — minutes completed today
 *  - remainingMinutes number  — minutes still pending today
 */

import { useRef, useEffect } from "react";
import { Chart } from "./_chartSetup";
import { CARD_CLS, CARD_TITLE_CLS } from "../_constants";

export default function TimeAllocationChart({ doneMinutes, remainingMinutes }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Destroy previous instance before re-creating
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Done", "Remaining"],
        datasets: [
          {
            // When nothing is done and nothing remains, show a placeholder slice
            data: [doneMinutes || 0, remainingMinutes || (doneMinutes ? 0 : 1)],
            backgroundColor: ["#10b981", "#e5e7eb"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { family: "Inter", size: 12 } },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [doneMinutes, remainingMinutes]);

  return (
    <div className={CARD_CLS}>
      <h3 className={CARD_TITLE_CLS}>Time Allocation</h3>
      <div className="max-w-[260px] mx-auto">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
