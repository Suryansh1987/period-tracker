"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PeriodForm } from "@/components/period-form";
import { toast } from "sonner";
import { DUMMY_USER_ID } from "@/lib/constants";

export default function SettingsPage() {
  const [periodEntries, setPeriodEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user's period data when the component mounts
  useEffect(() => {
    const fetchPeriodData = async () => {
      try {
        const res = await fetch("/api/period", {
          headers: {
            "X-User-Id": DUMMY_USER_ID,
          },
        });

        if (!res.ok) {
          throw new Error("Unable to fetch data from /api/period");
        }

        const result = await res.json();
        // Just double checking the structure
        if (result.entries) {
          setPeriodEntries(result.entries);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Couldn't load your data, try again?");
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData();
  }, []);

  const handleFormSubmit = async (formData, idx) => {
    try {
      const editing = formData.id !== undefined;

      const res = await fetch("/api/period", {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": DUMMY_USER_ID,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Saving failed");
      }

      const result = await res.json();

      const updated = [...periodEntries];
      if (editing) {
        updated[idx] = result.entry;
      } else {
        updated.push(result.entry); // appending new entry
      }

      setPeriodEntries(updated);
      toast.success("Saved! 🎉");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Something went wrong while saving");
    }
  };

  const handleAddNewCycle = () => {
    // Just pushing an empty object for a new cycle, might refactor later
    setPeriodEntries((prev) => [...prev, {}]);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your period tracking preferences and information
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            {/* TODO: maybe use a spinner component later */}
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : (
          periodEntries.map((entry, idx) => (
            <Card key={entry.id || idx}>
              <CardHeader>
                <CardTitle>Cycle {idx + 1}</CardTitle>
                <CardDescription>
                  {entry.startDate
                    ? `Started on ${entry.startDate}`
                    : "New cycle entry (no start date yet)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PeriodForm
                  initialData={entry}
                  onSubmit={(data) => handleFormSubmit(data, idx)}
                />
              </CardContent>
            </Card>
          ))
        )}

        {!loading && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleAddNewCycle}>
              + Add New Cycle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
