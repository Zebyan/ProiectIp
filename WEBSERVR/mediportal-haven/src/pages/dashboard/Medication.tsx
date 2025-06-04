
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, RefreshCw } from "lucide-react";
import MedicationTable from '@/components/medication/MedicationTable';
import CreateMedicationForm from '@/components/medication/CreateMedicationForm';

type Medication = {
  id: number;
  id_medicament: string;
  denumire: string;
  concentratie: string;
  forma_farmaceutica: string;
  pret: number;
  stoc: number;
  disponibilitate: boolean;
};

const Medication = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchMedications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const authToken = localStorage.getItem('authToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      const finalToken = authToken || token;

      if (!finalToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You need to be logged in to view medications"
        });
        return;
      }

      console.log("Fetching medications from API...");
      const response = await fetch('http://132.220.27.51/angajati/medic/medicamente', {
        method: 'GET',
        headers: {
          'Authorization': `${tokenType} ${finalToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch medications: ${response.status}`);
      }

      const data = await response.json();
      console.log("Medications fetched successfully:", data);
      setMedications(data);
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch medications. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMedication = async (medicationData: Omit<Medication, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const authToken = localStorage.getItem('authToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      const finalToken = authToken || token;

      if (!finalToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You need to be logged in to create medications"
        });
        return;
      }

      console.log("Creating new medication:", medicationData);
      const response = await fetch('http://132.220.27.51/angajati/medic/medicamente', {
        method: 'POST',
        headers: {
          'Authorization': `${tokenType} ${finalToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medicationData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create medication: ${response.status}`);
      }

      const newMedication = await response.json();
      console.log("Medication created successfully:", newMedication);
      
      // Refresh the medications list
      fetchMedications();
      setIsCreateModalOpen(false);
      
      toast({
        title: "Success",
        description: "Medication created successfully"
      });
    } catch (error) {
      console.error("Error creating medication:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create medication. Please try again."
      });
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Medication Management</h2>
          <p className="text-gray-600 mt-1">
            Monitor and manage medication inventory and transport requests
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading medications...</span>
          </div>
        ) : (
          <MedicationTable medications={medications} onRefresh={fetchMedications} />
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CreateMedicationForm
            onCreateMedication={handleCreateMedication}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Medication;
