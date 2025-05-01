"use client";

import { useState, useEffect } from "react";
import { PeriodCalendar } from "@/components/period-calendar";
import { PeriodForm } from "@/components/period-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DUMMY_USER_ID } from "@/lib/constants";

export default function CalendarPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const res = await fetch("/api/period");
        if (!res.ok) {
          const text = await res.text(); // Get backend error message
          throw new Error(`API responded with status ${res.status}: ${text}`);
        }
        const data = await res.json();

        // Update the entries state with fetched data
        setEntries(data.entries);
      } catch (err) {
        console.error("Error fetching period data:", err);
        toast.error("Failed to load period entries");
      } finally {
        setLoading(false); // Set loading to false once fetching is complete (either success or failure)
      }
    }

    fetchEntries();
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      const isEditing = !!editingEntry;

      const response = await fetch("/api/period", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": DUMMY_USER_ID
        },
        body: JSON.stringify(isEditing ? { ...data, id: editingEntry.id } : data)
      });

      if (!response.ok) throw new Error("Failed to save period entry");

      const result = await response.json();
      const updatedEntry = result.entry;

      setEntries((prev) =>
        isEditing
          ? prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
          : [updatedEntry, ...prev]
      );

      setEditingEntry(null);
      setFormOpen(false);
      toast.success("Period entry saved successfully!");
    } catch (error) {
      console.error("Error saving period entry:", error);
      toast.error("Failed to save period entry");
    }
  };

  const openNewForm = () => {
    setEditingEntry(null);
    setFormOpen(true);
  };

  const openEditForm = (entry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Period Calendar</h1>
          <p className="text-muted-foreground mt-2">
            View your cycle history and predictions.
          </p>
        </div>
        <Button onClick={openNewForm}>Add Period Info</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-lg border border-dashed">
          <h2 className="text-xl font-medium mb-2">No Period Data Available</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Start tracking your cycle by entering period data.
          </p>
          <Button onClick={openNewForm}>Set Up Your Cycle</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 border rounded-md bg-background shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    Last Period:{" "}
                    {new Date(entry.lastPeriodDate).toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Cycle Length: {entry.cycleLength} days | Duration:{" "}
                    {entry.periodDuration} days
                  </p>
                  {entry.notes && (
                    <p className="text-sm mt-2 italic text-muted-foreground">
                      Notes: {entry.notes}
                    </p>
                  )}
                </div>
                <Button size="sm" onClick={() => openEditForm(entry)}>
                  Edit
                </Button>
              </div>
              <div className="mt-4">
                <PeriodCalendar periodEntry={entry} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? "Update" : "Enter"} Period Information
            </DialogTitle>
            <DialogDescription>
              Please provide accurate details about your cycle.
            </DialogDescription>
          </DialogHeader>
          <PeriodForm
            initialData={editingEntry || undefined}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
