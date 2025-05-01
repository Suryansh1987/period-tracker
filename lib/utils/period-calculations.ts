import { addDays, differenceInDays, startOfDay } from "date-fns";
import { PeriodEntry, PeriodStats } from "@/types";

/**
 * Calculate various period-related statistics
 */
export function calculatePeriodStats(entry: PeriodEntry): PeriodStats {
  const lastPeriodDate = startOfDay(new Date(entry.lastPeriodDate));
  const cycleLength = entry.cycleLength;
  const periodDuration = entry.periodDuration;

  // Calculate the next period start date
  const nextPeriodPrediction = addDays(lastPeriodDate, cycleLength);
  
  // Calculate when the current/next period is expected to end
  const periodEndPrediction = addDays(nextPeriodPrediction, periodDuration);
  
  // Calculate the expected ovulation date (typically 14 days before the next period)
  const ovulationPrediction = addDays(nextPeriodPrediction, -14);
  
  // Calculate fertility window (typically 5 days before ovulation to 1 day after)
  const fertilityStart = addDays(ovulationPrediction, -5);
  const fertilityEnd = addDays(ovulationPrediction, 1);

  return {
    averageCycleLength: cycleLength,
    averagePeriodDuration: periodDuration,
    nextPeriodPrediction,
    periodEndPrediction,
    ovulationPrediction,
    fertility: {
      start: fertilityStart,
      end: fertilityEnd,
    },
  };
}

/**
 * Determine if a specific date is expected to be during a period
 */
export function isDateInPeriod(date: Date, entry: PeriodEntry): boolean {
  const dateToCheck = startOfDay(new Date(date));
  const lastPeriod = startOfDay(new Date(entry.lastPeriodDate));
  
  // Calculate how many days have passed since the last period
  const daysSinceLastPeriod = differenceInDays(dateToCheck, lastPeriod);
  
  // If it's within the period duration, it's a period day
  if (daysSinceLastPeriod >= 0 && daysSinceLastPeriod < entry.periodDuration) {
    return true;
  }
  
  // Check if it's within any projected periods
  const daysSinceLastPeriodModCycle = daysSinceLastPeriod % entry.cycleLength;
  return daysSinceLastPeriodModCycle >= 0 && daysSinceLastPeriodModCycle < entry.periodDuration;
}

/**
 * Get the cycle day (1-based) for a given date
 */
export function getCycleDay(date: Date, entry: PeriodEntry): number {
  const dateToCheck = startOfDay(new Date(date));
  const lastPeriod = startOfDay(new Date(entry.lastPeriodDate));
  
  // Calculate days since last period
  const daysSinceLastPeriod = differenceInDays(dateToCheck, lastPeriod);
  
  // Calculate which day of the cycle this is (1-based)
  if (daysSinceLastPeriod < 0) {
    // This date is before the last recorded period
    const cyclesAgo = Math.floor(Math.abs(daysSinceLastPeriod) / entry.cycleLength) + 1;
    const daysFromCycleStart = entry.cycleLength - (Math.abs(daysSinceLastPeriod) % entry.cycleLength);
    return daysFromCycleStart === entry.cycleLength ? 1 : daysFromCycleStart + 1;
  }
  
  // This date is on or after the last recorded period
  return (daysSinceLastPeriod % entry.cycleLength) + 1;
}

/**
 * Generate an array of dates for the next few cycles
 */
export function generatePeriodDates(entry: PeriodEntry, numCycles: number = 3): Date[] {
  const dates: Date[] = [];
  const lastPeriod = startOfDay(new Date(entry.lastPeriodDate));
  
  // Include the last period and future periods
  for (let i = 0; i < numCycles; i++) {
    const cycleStart = addDays(lastPeriod, i * entry.cycleLength);
    
    // Add each day of the period
    for (let day = 0; day < entry.periodDuration; day++) {
      dates.push(addDays(cycleStart, day));
    }
  }
  
  return dates;
}