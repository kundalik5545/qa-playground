import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DailyTrackerPage = () => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Daily Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Track your daily learning goals and progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Daily Tracker feature is coming soon. Check back later!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTrackerPage;
