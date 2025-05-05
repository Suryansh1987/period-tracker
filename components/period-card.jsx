"use client";

import { format, addDays, isBefore, isWithinInterval } from "date-fns";
import { CalendarIcon, CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculatePeriodStats } from "@/lib/utils/period-calculations";

// Just a simple period summary card
export function PeriodCard({ periodEntry, onEdit }) {
  const stats = calculatePeriodStats(periodEntry);
  const currentDate = new Date();

  const lastStart = new Date(periodEntry.lastPeriodDate);
  const predictedEnd = addDays(lastStart, periodEntry.periodDuration - 1);

  const isNow =
    isWithinInterval(currentDate, { start: lastStart, end: predictedEnd }) ||
    isWithinInterval(currentDate, { start: stats.nextPeriodPrediction, end: stats.periodEndPrediction });

  const isFuture = isBefore(currentDate, stats.nextPeriodPrediction);
  const isFinished = isBefore(stats.periodEndPrediction, currentDate);

  let daysMessage = "";

  if (isNow) {
    const remainingDays = Math.ceil(
      (stats.periodEndPrediction.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    daysMessage = `${remainingDays} day${remainingDays !== 1 ? "s" : ""} remaining in your period`;
  } else if (isFuture) {
    const daysUntil = Math.ceil(
      (stats.nextPeriodPrediction.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    daysMessage = `${daysUntil} day${daysUntil !== 1 ? "s" : ""} until your next period`;
  }

  return (
    <Card className={cn("overflow-hidden transition-all", isNow ? "border-pink-400 dark:border-pink-600" : "")}>
      <CardHeader
        className={cn(
          "pb-2",
          isNow
            ? "bg-pink-50 dark:bg-pink-900/20"
            : isFuture
            ? "bg-blue-50 dark:bg-blue-900/20"
            : "bg-gray-50 dark:bg-gray-800/50"
        )}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            {isNow ? (
              <>
                <div className="mr-2 h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                <span>Current Period</span>
              </>
            ) : isFuture ? (
              <>
                <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
                <span>Upcoming Period</span>
              </>
            ) : (
              <>
                <CalendarDays className="mr-2 h-5 w-5 text-gray-500" />
                <span>Period Info</span>
              </>
            )}
          </CardTitle>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Dates */}
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Period Start</p>
              <p className="font-medium">{format(lastStart, "PPP")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next Period</p>
              <p className="font-medium">{format(stats.nextPeriodPrediction, "PPP")}</p>
            </div>
          </div>

          {/* Message */}
          {daysMessage && (
            <div
              className={cn(
                "flex items-center p-3 rounded-md text-sm",
                isNow
                  ? "bg-pink-50 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300"
                  : "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
              )}
            >
              <Clock className="h-4 w-4 mr-2" />
              {daysMessage}
            </div>
          )}

          {/* Stats */}
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cycle Length</p>
              <p className="font-medium">{periodEntry.cycleLength} days</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Period Duration</p>
              <p className="font-medium">{periodEntry.periodDuration} days</p>
            </div>
          </div>

          {/* Ovulation info */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Ovulation Date (Est.)</p>
            <p className="font-medium">{format(stats.ovulationPrediction, "PPP")}</p>
          </div>

          {/* Fertility */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Fertility Window</p>
            <p className="font-medium">
              {format(stats.fertility.start, "MMM d")} – {format(stats.fertility.end, "MMM d, yyyy")}
            </p>
          </div>

          {/* Conditions */}
          {periodEntry.conditions?.length > 0 && periodEntry.conditions[0] !== "none" && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Medical Conditions</p>
              <div className="flex flex-wrap gap-1">
                {periodEntry.conditions.map((condition) => (
                  <span
                    key={condition}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  >
                    {condition.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Utility classnames merger
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
