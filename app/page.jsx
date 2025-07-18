"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PeriodForm } from "@/components/period-form";
import { PeriodCard } from "@/components/period-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DUMMY_USER_ID } from "@/lib/constants";

export default function Home() {
  const [periodEntries, setPeriodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch all period entries
  useEffect(() => {
    const fetchPeriodData = async () => {
      try {
        const response = await fetch("/api/period", {
          headers: {
            "X-User-Id": DUMMY_USER_ID,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch period data");
        }

        const data = await response.json();
        if (data.entries) {
          setPeriodEntries(data.entries);
        }
      } catch (error) {
        console.error("Error fetching period data:", error);
        toast.error("Failed to load period data");
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData();
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      const isUpdate = selectedEntry !== null;
      const response = await fetch("/api/period", {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": DUMMY_USER_ID,
        },
        body: JSON.stringify(isUpdate ? { ...data, id: selectedEntry.id } : data),
      });

      if (!response.ok) {
        throw new Error("Failed to save period data");
      }

      const result = await response.json();
      setFormOpen(false);
      setSelectedEntry(null);

      if (isUpdate) {
        setPeriodEntries((prev) =>
          prev.map((entry) => (entry.id === result.entry.id ? result.entry : entry))
        );
      } else {
        setPeriodEntries((prev) => [result.entry, ...prev]);
      }

      toast.success("Period information saved successfully!");
    } catch (error) {
      console.error("Error saving period data:", error);
      toast.error("Failed to save period data");
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Period Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track, predict, and understand your menstrual cycle
          </p>
        </div>
        {!loading && (
          <Button onClick={() => {
            setSelectedEntry(null);
            setFormOpen(true);
          }}>
            Add New Cycle
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : periodEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-lg border border-dashed">
          <h2 className="text-xl font-medium mb-2">Welcome to Period Tracker</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Lets get started by entering information about your cycle. This helps us provide accurate predictions.
          </p>
          <Button onClick={() => {
            setSelectedEntry(null);
            setFormOpen(true);
          }}>
            Set Up Your Cycle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {periodEntries.map((entry) => (
            <PeriodCard
              key={entry.id}
              periodEntry={entry}
              onEdit={() => {
                setSelectedEntry(entry);
                setFormOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEntry ? "Update" : "Enter"} Your Period Information
            </DialogTitle>
            <DialogDescription>
              Please provide the details about your menstrual cycle for accurate predictions.
            </DialogDescription>
          </DialogHeader>
          <PeriodForm
            initialData={selectedEntry || undefined}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
