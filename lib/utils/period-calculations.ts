import { addDays, differenceInDays, startOfDay } from "date-fns";
import { PeriodEntry, PeriodStats } from "@/types/index";


export function calculatePeriodStats(entry: PeriodEntry): PeriodStats {
  const lastPeriodStartDate = startOfDay(new Date(entry.lastPeriodDate)); 
  const cycleLengthInDays = entry.cycleLength; 
  const periodLastsFor = entry.periodDuration; 

 
  const predictedNextPeriodStart = addDays(lastPeriodStartDate, cycleLengthInDays);

 
  const predictedNextPeriodEnd = addDays(predictedNextPeriodStart, periodLastsFor);


  const estimatedOvulationDay = addDays(predictedNextPeriodStart, -14);

 
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
