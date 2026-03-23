"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];
const DEVICE_COLORS = { Mobile: "#6366f1", Desktop: "#22c55e", Unknown: "#94a3b8" };
const TOOLTIP_STYLE = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  color: "hsl(var(--foreground))",
};

export function ResponseCharts({ dailyData, pieData, deviceData, countryData }) {
  const totalDevices = deviceData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Row 1: daily line + answer pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart — daily responses */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold text-base">Daily Responses</h2>
            <p className="text-xs text-muted-foreground">Responses received per day (last 30 days)</p>
          </CardHeader>
          <CardContent>
            {dailyData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dailyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Responses"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie chart — answer distribution */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold text-base">Answer Distribution</h2>
            <p className="text-xs text-muted-foreground">Breakdown of all answers given</p>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: device pie + country bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold text-base">Device Type</h2>
            <p className="text-xs text-muted-foreground">Mobile vs Desktop visitors</p>
          </CardHeader>
          <CardContent>
            {deviceData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {deviceData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={DEVICE_COLORS[entry.name] ?? "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Summary row */}
                <div className="flex gap-4 justify-center">
                  {deviceData.map((d) => (
                    <div key={d.name} className="flex flex-col items-center gap-0.5">
                      <span
                        className="text-lg font-bold"
                        style={{ color: DEVICE_COLORS[d.name] ?? "#94a3b8" }}
                      >
                        {totalDevices > 0 ? Math.round((d.value / totalDevices) * 100) : 0}%
                      </span>
                      <span className="text-xs text-muted-foreground">{d.name}</span>
                      <span className="text-xs font-medium">{d.value} visits</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Country breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="font-semibold text-base">Top Countries</h2>
            <p className="text-xs text-muted-foreground">Responses by country (ISO code)</p>
          </CardHeader>
          <CardContent>
            {countryData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
            ) : countryData.length <= 8 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={countryData}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="country" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={36} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Responses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="overflow-y-auto max-h-56">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1.5 pr-4 font-medium text-muted-foreground">#</th>
                      <th className="text-left py-1.5 pr-4 font-medium text-muted-foreground">Country</th>
                      <th className="text-right py-1.5 font-medium text-muted-foreground">Responses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryData.map((row, i) => (
                      <tr key={row.country} className="border-b last:border-0">
                        <td className="py-1.5 pr-4 text-muted-foreground">{i + 1}</td>
                        <td className="py-1.5 pr-4 font-medium">{row.country}</td>
                        <td className="py-1.5 text-right tabular-nums">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
