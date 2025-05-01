"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeriodEntry } from "@/types";
import { isDateInPeriod, getCycleDay } from "@/lib/utils/period-calculations";
import { addMonths, format, isSameDay, startOfMonth } from "date-fns";

interface PeriodCalendarProps {
  periodEntry?: PeriodEntry;
}

export function PeriodCalendar({ periodEntry }: PeriodCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "3month" | "6month">("month");

  const generateDateClassNames = (date: Date) => {
    if (!periodEntry) return "";

    const isInPeriod = isDateInPeriod(date, periodEntry);
    const today = new Date();
    const isToday = isSameDay(date, today);
    const cycleDay = getCycleDay(date, periodEntry);
    
    let classNames = [];

    if (isInPeriod) {
      classNames.push("bg-pink-100 text-pink-900 hover:bg-pink-200 dark:bg-pink-900/40 dark:text-pink-100 dark:hover:bg-pink-800/60");
    }
    
    // Fertility window is usually 5 days before ovulation (cycle day 14 in a 28-day cycle) and 1 day after
    const isOvulationDay = cycleDay === Math.floor(periodEntry.cycleLength / 2);
    const isFertileDay = cycleDay >= Math.floor(periodEntry.cycleLength / 2) - 5 && 
                         cycleDay <= Math.floor(periodEntry.cycleLength / 2) + 1 &&
                         !isInPeriod;
    
    if (isOvulationDay) {
      classNames.push("!bg-blue-200 !text-blue-900 hover:!bg-blue-300 dark:!bg-blue-800/60 dark:!text-blue-100 dark:hover:!bg-blue-700/60");
      classNames.push("ovulation-day"); // Custom class for styling
    } else if (isFertileDay) {
      classNames.push("!bg-blue-50 !text-blue-900 hover:!bg-blue-100 dark:!bg-blue-900/30 dark:!text-blue-100 dark:hover:!bg-blue-800/40");
    }
    
    if (isToday) {
      classNames.push("border-2 border-primary");
    }
    
    return classNames.join(" ");
  };

  const renderCalendars = () => {
    let calendars = [];
    const numberOfMonths = view === "month" ? 1 : view === "3month" ? 3 : 6;
    
    for (let i = 0; i < numberOfMonths; i++) {
      const currentMonth = addMonths(startOfMonth(date), i);
      calendars.push(
        <div key={i} className="mb-6">
          <h3 className="mb-2 font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={currentMonth}
            className="rounded-md border"
            modifiersClassNames={{
              today: "bg-primary text-primary-foreground",
            }}
            modifiers={{
              // Custom modifier for styling specific days
              custom: date => {
                if (!periodEntry) return false;
                return isDateInPeriod(date, periodEntry) || 
                       getCycleDay(date, periodEntry) === Math.floor(periodEntry.cycleLength / 2);
              }
            }}
            styles={{
              day: (date) => {
                return { 
                  className: generateDateClassNames(date) 
                };
              }
            }}
          />
        </div>
      );
    }
    
    return calendars;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Period Calendar</CardTitle>
        <CardDescription>
          View your period cycles and predictions for the coming months
        </CardDescription>
        <Tabs defaultValue="month" value={view} onValueChange={(v) => setView(v as "month" | "3month" | "6month")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="month">1 Month</TabsTrigger>
            <TabsTrigger value="3month">3 Months</TabsTrigger>
            <TabsTrigger value="6month">6 Months</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {!periodEntry ? (
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">
              No period data available. Please add your period information.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-pink-400"></div>
                <span className="text-xs">Period Days</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-blue-400"></div>
                <span className="text-xs">Ovulation Day</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-blue-200"></div>
                <span className="text-xs">Fertile Window</span>
              </div>
            </div>
            <div className="space-y-6">
              {renderCalendars()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}