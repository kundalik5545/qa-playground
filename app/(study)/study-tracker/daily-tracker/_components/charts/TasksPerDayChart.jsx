"use client";

/**
 * TasksPerDayChart
 * -----------------
 * Stacked bar chart showing done vs remaining task counts per day.
 *
 * Props:
 *  - labels     string[]   — x-axis date labels
 *  - completed  number[]   — completed items per day
 *  - totals     number[]   — total items per day
 */

import { useRef, useEffect } from "react";
import { Chart } from "./_chartSetup";
import { CARD_CLS, CARD_TITLE_CLS } from "../_constants";

export default function TasksPerDayChart({ labels, completed, totals }) {
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
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Done",
            data: completed,
            backgroundColor: "#10b981",
            borderRadius: 4,
          },
          {
            label: "Remaining",
            data: totals.map((t, i) => t - completed[i]),
            backgroundColor: "#e5e7eb",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { family: "Inter", size: 12 } },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { font: { family: "Inter", size: 11 } },
            grid: { display: false },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { stepSize: 1, font: { family: "Inter" } },
            grid: { color: "#f3f4f6" },
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
  }, [labels, completed, totals]);

  return (
    <div className={CARD_CLS}>
      <h3 className={CARD_TITLE_CLS}>Tasks per Day</h3>
      <canvas ref={canvasRef} height={180} />
    </div>
  );
}
