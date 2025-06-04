
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type Medication = {
  id_medicament: number;
  denumire: string;
  concentratie: string;
  forma_farmaceutica: string;
  pret: number;
  stoc: number;
  disponibilitate: boolean;
};

type CreatePrescriptionFormProps = {
  patientCNP: string;
  patientName: string;
  onCreatePrescription: (prescription: any) => void;
  onCancel: () => void;
};

const CreatePrescriptionForm: React.FC<CreatePrescriptionFormProps> = ({
  patientCNP,
  patientName,
  onCreatePrescription,
  onCancel
}) => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMedications, setIsLoadingMedications] = useState(false);
  
  const [formData, setFormData] = useState({
    id_prescriptie: Math.floor(Math.random() * 1000000),
    cantitate: '',
    CNP: patientCNP,
    afectiune: '',
    id_medicament: ''
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    setIsLoadingMedications(true);
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

      const data: Medication[] = await response.json();
      setMedications(data);
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch medications. Please try again."
      });
    } finally {
      setIsLoadingMedications(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      id_medicament: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cantitate || !formData.id_medicament) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all required fields"
      });
      return;
    }

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
          description: "You need to be logged in to create prescriptions"
        });
        return;
      }

      const prescriptionData = {
        id_prescriptie: formData.id_prescriptie,
        cantitate: formData.cantitate,
        CNP: formData.CNP,
        afectiune: formData.afectiune,
        id_medicament: parseInt(formData.id_medicament)
      };

      console.log('Creating prescription:', prescriptionData);

      const response = await fetch('http://132.220.27.51/prescriptii/', {
        method: 'POST',
        headers: {
          'Authorization': `${tokenType} ${finalToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prescriptionData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to create prescription: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Prescription created:', responseData);

      onCreatePrescription(prescriptionData);
      
      toast({
        title: "Prescription Created",
        description: `Prescription created successfully for ${patientName}`
      });
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        variant: "destructive",
        title: "Error Creating Prescription",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMedication = medications.find(med => med.id_medicament.toString() === formData.id_medicament);

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">Create Prescription</h3>
      <p className="text-sm text-gray-600 mb-4">Patient: {patientName} (CNP: {patientCNP})</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="id_medicament">Medication *</Label>
          {isLoadingMedications ? (
            <div className="text-sm text-gray-500">Loading medications...</div>
          ) : (
            <Select value={formData.id_medicament} onValueChange={handleMedicationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select medication" />
              </SelectTrigger>
              <SelectContent>
                {medications.map((medication) => (
                  <SelectItem key={medication.id_medicament} value={medication.id_medicament.toString()}>
                    {medication.denumire} - {medication.concentratie} ({medication.forma_farmaceutica})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {selectedMedication && (
            <div className="text-xs text-gray-500 mt-1">
              Stock: {selectedMedication.stoc} | Price: ${selectedMedication.pret}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="cantitate">Quantity *</Label>
          <Input
            id="cantitate"
            name="cantitate"
            value={formData.cantitate}
            onChange={handleInputChange}
            placeholder="e.g., 30 tablets, 2 times daily"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="afectiune">Condition/Diagnosis</Label>
          <Input
            id="afectiune"
            name="afectiune"
            value={formData.afectiune}
            onChange={handleInputChange}
            placeholder="Medical condition"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Prescription'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePrescriptionForm;
