"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PeriodForm } from "@/components/period-form";
import { toast } from "sonner";
import { DUMMY_USER_ID } from "@/lib/constants";

export default function SettingsPage() {
  const [periodEntries, setPeriodEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all period data
  useEffect(() => {
    const fetchPeriodData = async () => {
      try {
        const response = await fetch('/api/period', {
          headers: {
            'X-User-Id': DUMMY_USER_ID
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch period data');
        }

        const data = await response.json();
        if (data.entries) {
          setPeriodEntries(data.entries);
        }
      } catch (error) {
        console.error('Error fetching period data:', error);
        toast.error('Failed to load period data');
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData();
  }, []);

  const handleFormSubmit = async (data, index) => {
    try {
      const isEdit = data.id !== undefined;
      const response = await fetch('/api/period', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': DUMMY_USER_ID
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save period data');
      }

      const result = await response.json();

      const updatedEntries = [...periodEntries];
      if (isEdit) {
        updatedEntries[index] = result.entry;
      } else {
        updatedEntries.push(result.entry);
      }

      setPeriodEntries(updatedEntries);
      toast.success('Period information saved successfully!');
    } catch (error) {
      console.error('Error saving period data:', error);
      toast.error('Failed to save period data');
    }
  };

  const handleAddNewCycle = () => {
    setPeriodEntries([...periodEntries, {}]); // Add empty entry for new cycle
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
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : (
          periodEntries.map((entry, index) => (
            <Card key={entry.id || index}>
              <CardHeader>
                <CardTitle>Cycle {index + 1}</CardTitle>
                <CardDescription>
                  {entry.startDate ? `Started on ${entry.startDate}` : 'New cycle entry'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PeriodForm
                  initialData={entry}
                  onSubmit={(data) => handleFormSubmit(data, index)}
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
