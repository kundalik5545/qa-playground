"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { tooltipStyle } from "./chartConfig";

export default function CompletionBreakdownChart({ completionPieData, hasCompletionData }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="font-semibold text-base">Completion Breakdown</h2>
      </CardHeader>
      <CardContent>
        {!hasCompletionData ? (
          <div className="flex items-center justify-center h-[340px] text-sm text-muted-foreground">
            No completed topics yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={completionPieData}
                cx="50%"
                cy="45%"
                innerRadius={68}
                outerRadius={108}
                dataKey="value"
                nameKey="name"
                strokeWidth={2}
                stroke="hsl(var(--card))"
              >
                {completionPieData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
