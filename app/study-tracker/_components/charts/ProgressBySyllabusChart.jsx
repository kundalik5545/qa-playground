"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { tooltipStyle } from "./chartConfig";

export default function ProgressBySyllabusChart({ barData }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="font-semibold text-base">Progress by Syllabus</h2>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={barData}
            margin={{ top: 4, right: 8, left: -16, bottom: 56 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name, props) => {
                const d = props?.payload;
                if (name === "Completed" && d) {
                  const total = (d.Completed ?? 0) + (d.Remaining ?? 0);
                  const pct = total ? Math.round(((d.Completed ?? 0) / total) * 100) : 0;
                  return [`${value} (${pct}%)`, name];
                }
                return [value, name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar dataKey="Completed" stackId="a">
              {barData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
            <Bar dataKey="Remaining" stackId="a" radius={[4, 4, 0, 0]}>
              {barData.map((d, i) => (
                <Cell key={i} fill={d.color + "33"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
