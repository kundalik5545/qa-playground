"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { tooltipStyle } from "./chartConfig";

export default function TodaysTasksChart({ taskPieData, hasTasksToday, todayDone, todayTasksLength }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="font-semibold text-base">Today's Tasks</h2>
        <p className="text-xs text-muted-foreground">
          {hasTasksToday
            ? `${todayDone} / ${todayTasksLength} completed`
            : "No tasks today"}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={taskPieData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              dataKey="value"
              nameKey="name"
              strokeWidth={0}
            >
              <Cell fill="#10b981" />
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
