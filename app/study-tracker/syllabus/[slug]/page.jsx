import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SyllabusDetailPage = async ({ params }) => {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").toUpperCase();

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">
          Detailed syllabus and learning path
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The detailed syllabus view is coming soon. Check back later!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SyllabusDetailPage;
