"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { tooltipStyle } from "./chartConfig";

export default function DailyTaskCompletionChart({ taskCompData }) {
  const hasAnyData = taskCompData.some((d) => d.Total > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="font-semibold text-base">
          Daily Task Progress{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (last 14 days)
          </span>
        </h2>
      </CardHeader>
      <CardContent>
        {!hasAnyData ? (
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No daily tasks recorded yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={taskCompData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  if (name === "Done") return [value, "Done"];
                  if (name === "Total") return [value, "Total"];
                  return [value, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="Total"
                name="Total"
                stroke="#94a3b8"
                strokeWidth={2}
                fill="url(#gradTotal)"
                dot={{ r: 3, fill: "#94a3b8", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls={true}
              />
              <Area
                type="monotone"
                dataKey="Done"
                name="Done"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#gradDone)"
                dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
