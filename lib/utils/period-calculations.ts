import { addDays, differenceInDays, startOfDay } from "date-fns";
import { PeriodEntry, PeriodStats } from "@/types/index";

// 🔮 Predicts the next period, ovulation, and fertility window based on past cycle info
export function calculatePeriodStats(entry: PeriodEntry): PeriodStats {
  const lastPeriodStartDate = startOfDay(new Date(entry.lastPeriodDate)); // Normalize date to start of the day
  const cycleLengthInDays = entry.cycleLength; // Average number of days between periods
  const periodLastsFor = entry.periodDuration; // How many days the period usually lasts

  // Estimate next period start by adding the cycle length to last period date
  const predictedNextPeriodStart = addDays(lastPeriodStartDate, cycleLengthInDays);

  // Estimate when that next period will end
  const predictedNextPeriodEnd = addDays(predictedNextPeriodStart, periodLastsFor);

  // Estimate ovulation (usually 14 days before next period)
  const estimatedOvulationDay = addDays(predictedNextPeriodStart, -14);

  // Fertility window: starts 5 days before ovulation, ends 1 day after
  const fertileWindowStart = addDays(estimatedOvulationDay, -5);
  const fertileWindowEnd = addDays(estimatedOvulationDay, 1);

  return {
    averageCycleLength: cycleLengthInDays,
    averagePeriodDuration: periodLastsFor,
    nextPeriodPrediction: predictedNextPeriodStart,
    periodEndPrediction: predictedNextPeriodEnd,
    ovulationPrediction: estimatedOvulationDay,
    fertility: {
      start: fertileWindowStart,
      end: fertileWindowEnd,
    },
  };
}

// 🩸 Checks if a given date falls within a period
export function isDateInPeriod(date: Date, entry: PeriodEntry): boolean {
  const dayToCheck = startOfDay(new Date(date));
  const lastPeriodStart = startOfDay(new Date(entry.lastPeriodDate));

  const daysSinceLastPeriod = differenceInDays(dayToCheck, lastPeriodStart);

  // If the date is within this cycle's period duration
  if (daysSinceLastPeriod >= 0 && daysSinceLastPeriod < entry.periodDuration) {
    return true;
  }

  // For recurring periods: check if it's within any cycle's period duration
  const daysInCurrentCycle = daysSinceLastPeriod % entry.cycleLength;
  return daysInCurrentCycle >= 0 && daysInCurrentCycle < entry.periodDuration;
}

// 📆 Tells you what "cycle day" it is (e.g. Day 1 of your cycle, Day 15, etc.)
export function getCycleDay(date: Date, entry: PeriodEntry): number {
  const dayToCheck = startOfDay(new Date(date));
  const lastPeriodStart = startOfDay(new Date(entry.lastPeriodDate));
  const daysSinceLastPeriod = differenceInDays(dayToCheck, lastPeriodStart);

  // If the date is before the last recorded period
  if (daysSinceLastPeriod < 0) {
    const cyclesAgo = Math.floor(Math.abs(daysSinceLastPeriod) / entry.cycleLength) + 1;
    const daysUntilCycleStart = entry.cycleLength - (Math.abs(daysSinceLastPeriod) % entry.cycleLength);
    return daysUntilCycleStart === entry.cycleLength ? 1 : daysUntilCycleStart + 1;
  }

  // Normal case: just return the cycle day number
  return (daysSinceLastPeriod % entry.cycleLength) + 1;
}

// 📅 Generates a list of all period dates for the next few cycles
export function generatePeriodDates(entry: PeriodEntry, numCycles: number = 3): Date[] {
  const periodDates: Date[] = [];
  const lastPeriodStart = startOfDay(new Date(entry.lastPeriodDate));

  // Go through each cycle and add all period days to the list
  for (let cycleIndex = 0; cycleIndex < numCycles; cycleIndex++) {
    const thisCycleStart = addDays(lastPeriodStart, cycleIndex * entry.cycleLength);

    // Add all days in this cycle's period duration
    for (let day = 0; day < entry.periodDuration; day++) {
      periodDates.push(addDays(thisCycleStart, day));
    }
  }

  return periodDates;
}
