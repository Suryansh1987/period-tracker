"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PeriodForm } from "@/components/period-form";
import { toast } from "sonner";
import { DUMMY_USER_ID } from "@/lib/constants";
import type { PeriodEntry } from "@/types";

export default function SettingsPage() {
  const [periodData, setPeriodData] = useState<PeriodEntry | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleFormSubmit = async (data: any) => {
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
      toast.success('Period information saved successfully!');
    } catch (error) {
      console.error('Error saving period data:', error);
      toast.error('Failed to save period data');
    }
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
        <Card>
          <CardHeader>
            <CardTitle>Cycle Settings</CardTitle>
            <CardDescription>
              Update your cycle information and medical conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
              </div>
            ) : (
              <PeriodForm 
                initialData={periodData || undefined} 
                onSubmit={handleFormSubmit} 
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your period tracking data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Export Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Download your period tracking history as a CSV file
                  </p>
                </div>
                <Button variant="outline" disabled={!periodData}>
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete All Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently remove all your period tracking data
                  </p>
                </div>
                <Button variant="destructive" disabled={!periodData}>
                  Delete All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}