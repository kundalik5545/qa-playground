import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponseCharts } from "./_components/ResponseCharts";

export const dynamic = "force-dynamic";

function buildDailyData(responses) {
  const counts = {};
  for (const r of responses) {
    const date = new Date(r.answeredAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    counts[date] = (counts[date] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .slice(-30);
}

function buildPieData(responses) {
  const counts = {};
  for (const r of responses) {
    for (const answer of Object.values(r.responses)) {
      const label = String(answer);
      counts[label] = (counts[label] ?? 0) + 1;
    }
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function getDeviceType(userAgent) {
  if (!userAgent) return "Unknown";
  if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return "Mobile";
  }
  return "Desktop";
}

function buildDeviceData(responses) {
  const counts = {};
  for (const r of responses) {
    const device = getDeviceType(r.userAgent);
    counts[device] = (counts[device] ?? 0) + 1;
  }
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
}

function buildCountryData(responses) {
  const counts = {};
  for (const r of responses) {
    const country = r.country || "Unknown";
    counts[country] = (counts[country] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

export default async function ResponsesPage() {
  const responses = await prisma.alertResponse.findMany({
    orderBy: { answeredAt: "asc" },
    take: 500,
  });

  const dailyData = buildDailyData(responses);
  const pieData = buildPieData(responses);
  const deviceData = buildDeviceData(responses);
  const countryData = buildCountryData(responses);
  const total = responses.length;

  // Reverse for the list view (newest first)
  const listResponses = [...responses].reverse().slice(0, 50);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alert Responses</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {total} response{total !== 1 ? "s" : ""} collected
        </p>
      </div>

      {/* Charts */}
      <ResponseCharts
        dailyData={dailyData}
        pieData={pieData}
        deviceData={deviceData}
        countryData={countryData}
      />

      {/* Response list */}
      {listResponses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No responses yet. They will appear here once visitors answer the popup.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <h2 className="font-semibold text-base">Recent Responses</h2>
          {listResponses.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between gap-4">
                <span className="text-sm font-medium">
                  {new Date(r.answeredAt).toLocaleString()}
                </span>
                {r.userAgent && (
                  <span className="text-xs text-muted-foreground truncate max-w-xs">
                    {r.userAgent.split(" ").slice(0, 3).join(" ")}…
                  </span>
                )}
              </CardHeader>
              <CardContent className="space-y-1.5">
                {Object.entries(r.responses).map(([questionId, answer]) => (
                  <div
                    key={questionId}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-muted-foreground">{questionId}</span>
                    <Badge variant="outline">{String(answer)}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
