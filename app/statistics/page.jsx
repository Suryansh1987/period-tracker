"use client";

import { useState, useEffect } from "react";
import { PeriodStatistics } from "@/components/period-stats";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PeriodForm } from "@/components/period-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DUMMY_USER_ID } from "@/lib/constants";

export default function StatisticsPage() {
  const [periodData, setPeriodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  // Fetch period data
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
        // Get the most recent entry if any exist
        if (data.entries && data.entries.length > 0) {
          setPeriodData(data.entries[0]);
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

  const handleFormSubmit = async (data) => {
    try {
      const response = await fetch('/api/period', {
        method: periodData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': DUMMY_USER_ID
        },
        body: JSON.stringify(periodData ? { ...data, id: periodData.id } : data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save period data');
      }
      
      const result = await response.json();
      
      setPeriodData(result.entry);
      setFormOpen(false);
      toast.success('Period information saved successfully!');
    } catch (error) {
      console.error('Error saving period data:', error);
      toast.error('Failed to save period data');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cycle Statistics</h1>
          <p className="text-muted-foreground mt-2">
            View insights and statistics about your menstrual cycle
          </p>
        </div>
        
        {periodData && (
          <Button onClick={() => setFormOpen(true)}>Update Cycle Information</Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : (
        <>
          {!periodData ? (
            <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-lg border border-dashed">
              <h2 className="text-xl font-medium mb-2">No Period Data Available</h2>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Let's get started by entering information about your cycle. This helps us provide detailed statistics and insights.
              </p>
              <Button onClick={() => setFormOpen(true)}>Set Up Your Cycle</Button>
            </div>
          ) : (
            <div className="space-y-6">
              <PeriodStatistics periodEntry={periodData} />
            </div>
          )}

          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{periodData ? 'Update' : 'Enter'} Your Period Information</DialogTitle>
                <DialogDescription>
                  Please provide the details about your menstrual cycle for accurate statistics.
                </DialogDescription>
              </DialogHeader>
              <PeriodForm 
                initialData={periodData || undefined} 
                onSubmit={handleFormSubmit} 
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
