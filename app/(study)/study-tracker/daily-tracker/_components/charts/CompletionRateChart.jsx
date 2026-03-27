"use client";

/**
 * CompletionRateChart
 * -------------------
 * Amber line chart showing the daily completion percentage
 * over the last 7 or 30 days.
 *
 * Props:
 *  - labels        string[]   — x-axis date labels
 *  - ratePct       (number|null)[]  — completion % per day (null = no data)
 *  - filterMode    "weekly" | "monthly"
 */

import { useRef, useEffect } from "react";
import { Chart } from "./_chartSetup";
import { CARD_CLS, CARD_TITLE_CLS } from "../_constants";
import { cn } from "@/lib/utils";

export default function CompletionRateChart({ labels, ratePct, filterMode }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Destroy any existing chart instance before re-creating
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Completion %",
            data: ratePct,
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245,158,11,0.08)",
            borderWidth: 2.5,
            pointBackgroundColor: "#f59e0b",
            pointRadius: 4,
            fill: true,
            tension: 0.35,
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { callback: (v) => v + "%", font: { family: "Inter" } },
            grid: { color: "#f3f4f6" },
          },
          x: {
            ticks: { font: { family: "Inter", size: 11 } },
            grid: { display: false },
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
  }, [labels, ratePct]);

  return (
    <div className={cn(CARD_CLS, "mb-[10px]")}>
      <h3 className={CARD_TITLE_CLS}>
        Completion Rate{" "}
        <span className="text-[0.73rem] font-normal text-gray-400 ml-[5px]">
          ({filterMode === "weekly" ? "last 7 days" : "last 30 days"})
        </span>
      </h3>
      <canvas ref={canvasRef} height={140} />
    </div>
  );
}
