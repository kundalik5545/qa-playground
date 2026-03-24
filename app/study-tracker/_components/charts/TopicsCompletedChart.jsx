"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { tooltipStyle } from "./chartConfig";

export default function TopicsCompletedChart({ topicsLineData, syllabi, syllabusIds }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="font-semibold text-base">
          Topics Completed{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (last 14 days)
          </span>
        </h2>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={topicsLineData}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tickCount={6}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              wrapperStyle={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", paddingTop: 8 }}
              iconSize={12}
            />
            {syllabusIds.map((id) => {
              const syl = syllabi[id];
              return (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={syl.label}
                  stroke={syl.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: syl.color, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: syl.color, stroke: "white", strokeWidth: 2 }}
                  connectNulls={true}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
