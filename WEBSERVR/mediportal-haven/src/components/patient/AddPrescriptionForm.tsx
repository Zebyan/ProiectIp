
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NewPrescription } from '@/types/patient';

type AddPrescriptionFormProps = {
  newPrescription: NewPrescription;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPrescription: () => void;
  onCancel: () => void;
};

const AddPrescriptionForm: React.FC<AddPrescriptionFormProps> = ({
  newPrescription,
  onInputChange,
  onAddPrescription,
  onCancel
}) => {
  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-xl font-bold mb-4">Add New Prescription</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="medication">Medication *</Label>
          <Input
            id="medication"
            name="medication"
            value={newPrescription.medication}
            onChange={onInputChange}
            placeholder="Medication name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="dosage">Dosage *</Label>
          <Input
            id="dosage"
            name="dosage"
            value={newPrescription.dosage}
            onChange={onInputChange}
            placeholder="e.g., 250mg"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Input
            id="frequency"
            name="frequency"
            value={newPrescription.frequency}
            onChange={onInputChange}
            placeholder="e.g., Every 8 hours"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={newPrescription.startDate}
              onChange={onInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={newPrescription.endDate}
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="prescribedBy">Prescribed By</Label>
          <Input
            id="prescribedBy"
            name="prescribedBy"
            value={newPrescription.prescribedBy}
            onChange={onInputChange}
            placeholder="Doctor's name"
          />
        </div>
        
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            name="notes"
            value={newPrescription.notes}
            onChange={onInputChange}
            placeholder="Additional notes"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onAddPrescription}>
            Add Prescription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPrescriptionForm;
