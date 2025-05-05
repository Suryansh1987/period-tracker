"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CYCLE_LENGTH,
  DEFAULT_PERIOD_DURATION,
  MIN_CYCLE_LENGTH,
  MAX_CYCLE_LENGTH,
  MIN_PERIOD_DURATION,
  MAX_PERIOD_DURATION,
  PERIOD_CONDITIONS,
} from "@/lib/constants";

const formSchema = z.object({
  lastPeriodDate: z.date({
    required_error: "Please pick the date your last period started.",
  }),
  cycleLength: z.coerce
    .number()
    .min(MIN_CYCLE_LENGTH)
    .max(MAX_CYCLE_LENGTH)
    .default(DEFAULT_CYCLE_LENGTH),
  periodDuration: z.coerce
    .number()
    .min(MIN_PERIOD_DURATION)
    .max(MAX_PERIOD_DURATION)
    .default(DEFAULT_PERIOD_DURATION),
  conditions: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export function PeriodForm({ initialData, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastPeriodDate: initialData?.lastPeriodDate
        ? new Date(initialData.lastPeriodDate)
        : new Date(),
      cycleLength: initialData?.cycleLength || DEFAULT_CYCLE_LENGTH,
      periodDuration: initialData?.periodDuration || DEFAULT_PERIOD_DURATION,
      conditions: initialData?.conditions || [],
      notes: initialData?.notes || "",
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast.success("Your info has been saved 💾");
    } catch (error) {
      console.error("Error saving period info:", error);
      toast.error("Something went wrong — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="lastPeriodDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>When did your last period start?</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Choose a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>This helps us calculate your cycle and predictions.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cycleLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  How long is your cycle?
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 inline opacity-70" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Count the number of days from the first day of one period to the day before the next one starts.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Usually around 28 days, but can range from {MIN_CYCLE_LENGTH} to {MAX_CYCLE_LENGTH}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="periodDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How many days does your period last?</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Most people bleed for {MIN_PERIOD_DURATION}–{MAX_PERIOD_DURATION} days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conditions"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Do you have any known conditions?</FormLabel>
                <FormDescription>Choose anything that applies. You can skip this if none apply.</FormDescription>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {PERIOD_CONDITIONS.map((condition) => (
                  <FormField
                    key={condition.value}
                    control={form.control}
                    name="conditions"
                    render={({ field }) => (
                      <FormItem
                        key={condition.value}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(condition.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (condition.value === "none") {
                                  field.onChange(["none"]);
                                } else {
                                  const withoutNone = field.value.filter((val) => val !== "none");
                                  field.onChange([...withoutNone, condition.value]);
                                }
                              } else {
                                field.onChange(
                                  field.value.filter((val) => val !== condition.value)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">{condition.label}</FormLabel>
                          <FormDescription className="text-xs">{condition.description}</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anything else you'd like to add?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional: symptoms, mood, irregularities, etc."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Use this space for personal notes about your cycle.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Saving..." : "Save My Cycle Info"}
        </Button>
      </form>
    </Form>
  );
}
