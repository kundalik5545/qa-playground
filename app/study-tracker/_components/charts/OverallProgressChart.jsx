"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { tooltipStyle } from "./chartConfig";

export default function OverallProgressChart({ overallPieData, allStats }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="font-semibold text-base">Overall Progress</h2>
        <p className="text-xs text-muted-foreground">
          {allStats.done} / {allStats.total} topics
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={overallPieData}
              cx="50%"
              cy="50%"
              innerRadius={78}
              outerRadius={108}
              dataKey="value"
              nameKey="name"
              strokeWidth={0}
            >
              <Cell fill="#2563eb" />
              <Cell fill="#e5e7eb" />
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
