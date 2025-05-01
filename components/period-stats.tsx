"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeriodEntry, PeriodStats } from "@/types";
import { calculatePeriodStats } from "@/lib/utils/period-calculations";
import { format } from "date-fns";

interface PeriodStatisticsProps {
  periodEntry?: PeriodEntry;
  periodHistory?: any[]; // In a real app, this would be actual period history data
}

export function PeriodStatistics({ periodEntry, periodHistory = [] }: PeriodStatisticsProps) {
  const stats = periodEntry ? calculatePeriodStats(periodEntry) : null;

  // Mock data for visualization - in a real app, this would come from actual period history
  const mockCycleLengths = [
    { month: 'Jan', days: 28 },
    { month: 'Feb', days: 27 },
    { month: 'Mar', days: 29 },
    { month: 'Apr', days: 28 },
    { month: 'May', days: 30 },
    { month: 'Jun', days: 28 },
  ];

  const mockPeriodDurations = [
    { month: 'Jan', days: 5 },
    { month: 'Feb', days: 6 },
    { month: 'Mar', days: 5 },
    { month: 'Apr', days: 4 },
    { month: 'May', days: 5 },
    { month: 'Jun', days: 5 },
  ];

  const mockSymptoms = [
    { name: 'Cramps', count: 10 },
    { name: 'Headache', count: 6 },
    { name: 'Bloating', count: 8 },
    { name: 'Fatigue', count: 12 },
    { name: 'Mood Swings', count: 7 },
  ];

  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8'];

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm text-xs">
          <p className="label">{`${label}: ${payload[0].value} days`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm text-xs">
          <p className="label">{`${payload[0].name}: ${payload[0].value} times`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cycle Statistics</CardTitle>
        <CardDescription>
          View statistics and insights about your menstrual cycle
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!stats ? (
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">
              No period data available. Please add your period information to see statistics.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <div className="flex flex-col space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">Cycle Length</span>
                  <span className="text-2xl font-bold">{stats.averageCycleLength} days</span>
                </div>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <div className="flex flex-col space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">Period Duration</span>
                  <span className="text-2xl font-bold">{stats.averagePeriodDuration} days</span>
                </div>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <div className="flex flex-col space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">Next Period</span>
                  <span className="text-2xl font-bold">{format(stats.nextPeriodPrediction, "MMM d")}</span>
                </div>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <div className="flex flex-col space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">Ovulation Day</span>
                  <span className="text-2xl font-bold">{format(stats.ovulationPrediction, "MMM d")}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="cycle">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cycle">Cycle Length</TabsTrigger>
                <TabsTrigger value="duration">Period Duration</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              </TabsList>
              <TabsContent value="cycle" className="pt-4">
                <h4 className="mb-4 text-sm font-medium">Cycle Length History</h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockCycleLengths} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[20, 35]} />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar dataKey="days" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="duration" className="pt-4">
                <h4 className="mb-4 text-sm font-medium">Period Duration History</h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockPeriodDurations} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar dataKey="days" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="symptoms" className="pt-4">
                <h4 className="mb-4 text-sm font-medium">Common Symptoms</h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockSymptoms}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                      >
                        {mockSymptoms.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {mockSymptoms.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div 
                        className="mr-1 h-3 w-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}