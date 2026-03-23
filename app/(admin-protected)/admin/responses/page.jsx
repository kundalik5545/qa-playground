import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ResponsesPage() {
  const responses = await prisma.alertResponse.findMany({
    orderBy: { answeredAt: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alert Responses</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {responses.length} response{responses.length !== 1 ? "s" : ""} collected
          </p>
        </div>
      </div>

      {responses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No responses yet. They will appear here once visitors answer the popup.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {responses.map((r) => (
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
                  <div key={questionId} className="flex items-center justify-between gap-4 text-sm">
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
