import { PeriodCondition, SymptomOption } from "@/types";

export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_PERIOD_DURATION = 5;
export const MIN_CYCLE_LENGTH = 21;
export const MAX_CYCLE_LENGTH = 45;
export const MIN_PERIOD_DURATION = 2;
export const MAX_PERIOD_DURATION = 10;

export const FLOW_LABELS = {
  1: "Very Light",
  2: "Light",
  3: "Medium",
  4: "Heavy",
  5: "Very Heavy"
};

export const PERIOD_CONDITIONS: PeriodCondition[] = [
  { 
    value: "none", 
    label: "None",
    description: "No known medical conditions affecting your cycle"
  },
  { 
    value: "pcos", 
    label: "PCOS",
    description: "Polycystic Ovary Syndrome - can cause irregular periods"
  },
  { 
    value: "endometriosis", 
    label: "Endometriosis",
    description: "A condition where tissue similar to the lining of the womb grows elsewhere"
  },
  { 
    value: "anemia", 
    label: "Anemia",
    description: "Low iron levels which can be affected by or cause heavy periods"
  },
  { 
    value: "thyroid_disorder", 
    label: "Thyroid Disorder",
    description: "Thyroid conditions can affect menstrual regularity"
  },
  { 
    value: "stress", 
    label: "High Stress",
    description: "Stress can impact cycle regularity and symptoms"
  },
  { 
    value: "other", 
    label: "Other",
    description: "Other conditions affecting your cycle"
  }
];

export const SYMPTOMS: SymptomOption[] = [
  { value: "cramps", label: "Cramps", category: "physical" },
  { value: "headache", label: "Headache", category: "physical" },
  { value: "backache", label: "Backache", category: "physical" },
  { value: "nausea", label: "Nausea", category: "physical" },
  { value: "bloating", label: "Bloating", category: "physical" },
  { value: "breast_tenderness", label: "Breast Tenderness", category: "physical" },
  { value: "fatigue", label: "Fatigue", category: "physical" },
  { value: "acne", label: "Acne", category: "physical" },
  { value: "mood_swings", label: "Mood Swings", category: "emotional" },
  { value: "irritability", label: "Irritability", category: "emotional" },
  { value: "anxiety", label: "Anxiety", category: "emotional" },
  { value: "depression", label: "Depression", category: "emotional" },
  { value: "cravings", label: "Food Cravings", category: "physical" },
  { value: "insomnia", label: "Insomnia", category: "physical" },
  { value: "other", label: "Other", category: "other" }
];

export const DUMMY_USER_ID = "user-123"; // For demonstration purposes only