
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

type CreateMedicationFormProps = {
  onCreateMedication: (medication: Omit<Medication, 'id'>) => void;
  onCancel: () => void;
};

const CreateMedicationForm: React.FC<CreateMedicationFormProps> = ({
  onCreateMedication,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    id_medicament: '',
    denumire: '',
    stoc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_medicament || !formData.denumire || !formData.stoc) {
      return;
    }

    onCreateMedication({
      id_medicament: formData.id_medicament,
      denumire: formData.denumire,
      concentratie: '',
      forma_farmaceutica: '',
      pret: 0,
      stoc: parseInt(formData.stoc),
      disponibilitate: true
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-xl font-bold mb-4">Add New Medication</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="id_medicament">Medication ID *</Label>
          <Input
            id="id_medicament"
            name="id_medicament"
            value={formData.id_medicament}
            onChange={handleInputChange}
            placeholder="Medication ID"
            required
          />
        </div>

        <div>
          <Label htmlFor="denumire">Name *</Label>
          <Input
            id="denumire"
            name="denumire"
            value={formData.denumire}
            onChange={handleInputChange}
            placeholder="Medication name"
            required
          />
        </div>

        <div>
          <Label htmlFor="stoc">Stock *</Label>
          <Input
            id="stoc"
            name="stoc"
            type="number"
            value={formData.stoc}
            onChange={handleInputChange}
            placeholder="0"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add Medication
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateMedicationForm;
