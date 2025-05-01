export interface PeriodEntry {
  id?: number;
  userId: string;
  lastPeriodDate: Date;
  cycleLength: number;
  periodDuration: number;
  conditions?: string[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PeriodDay {
  id?: number;
  userId: string;
  date: Date;
  flow: number;
  symptoms?: string[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PeriodStats {
  averageCycleLength: number;
  averagePeriodDuration: number;
  nextPeriodPrediction: Date;
  periodEndPrediction: Date;
  ovulationPrediction: Date;
  fertility: {
    start: Date;
    end: Date;
  };
}

export interface PeriodCondition {
  value: string;
  label: string;
  description: string;
}

export type FlowLevel = 1 | 2 | 3 | 4 | 5;

export interface SymptomOption {
  value: string;
  label: string;
  category: 'physical' | 'emotional' | 'other';
}