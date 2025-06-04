
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import type { Patient, PatientSex, RhFactor } from '@/types/patient';

type EditPatientFormProps = {
  patient: Patient;
  onPatientUpdate: (updatedPatient: Patient) => void;
  onCancel: () => void;
};

const EditPatientForm: React.FC<EditPatientFormProps> = ({
  patient,
  onPatientUpdate,
  onCancel
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    CNP: patient.CNP || '',
    nume: patient.nume,
    prenume: patient.prenume,
    judet: patient.judet,
    localitate: patient.localitate,
    strada: patient.strada,
    nr_strada: patient.nr_strada.toString(),
    scara: patient.scara,
    apartament: patient.apartament.toString(),
    telefon: patient.telefon,
    email: patient.email,
    profesie: patient.profesie,
    loc_de_munca: patient.loc_de_munca,
    sex: patient.sex,
    grupa_sange: patient.grupa_sange,
    rh: patient.rh,
    id_pat: patient.id_pat
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.CNP) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "CNP is required to update patient data"
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
          description: "You need to be logged in to update patient data"
        });
        return;
      }

      const updateData = {
        CNP: formData.CNP,
        nume: formData.nume,
        prenume: formData.prenume,
        judet: formData.judet,
        localitate: formData.localitate,
        strada: formData.strada,
        nr_strada: parseInt(formData.nr_strada) || 0,
        scara: formData.scara,
        apartament: parseInt(formData.apartament) || 0,
        telefon: formData.telefon,
        email: formData.email,
        profesie: formData.profesie,
        loc_de_munca: formData.loc_de_munca,
        sex: formData.sex,
        grupa_sange: formData.grupa_sange,
        rh: formData.rh,
        id_pat: formData.id_pat
      };

      console.log(`Updating patient with CNP: ${formData.CNP}`);
      const response = await fetch(`http://132.220.27.51/angajati/medic/${formData.CNP}`, {
        method: 'PUT',
        headers: {
          'Authorization': `${tokenType} ${finalToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update patient: ${response.status}`);
      }

      const updatedPatient: Patient = {
        ...patient,
        ...updateData,
        nr_strada: parseInt(formData.nr_strada) || 0,
        apartament: parseInt(formData.apartament) || 0
      };

      onPatientUpdate(updatedPatient);
      
      toast({
        title: "Patient Updated",
        description: `${formData.prenume} ${formData.nume} has been updated successfully`
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update patient. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle>Edit Patient: {patient.prenume} {patient.nume}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="CNP">CNP *</Label>
              <Input
                id="CNP"
                name="CNP"
                value={formData.CNP}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="id_pat">Bed ID *</Label>
              <Input
                id="id_pat"
                name="id_pat"
                value={formData.id_pat}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nume">Last Name *</Label>
              <Input
                id="nume"
                name="nume"
                value={formData.nume}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="prenume">First Name *</Label>
              <Input
                id="prenume"
                name="prenume"
                value={formData.prenume}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="judet">County</Label>
              <Input
                id="judet"
                name="judet"
                value={formData.judet}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="localitate">City</Label>
              <Input
                id="localitate"
                name="localitate"
                value={formData.localitate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="strada">Street</Label>
              <Input
                id="strada"
                name="strada"
                value={formData.strada}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="nr_strada">Street Number</Label>
              <Input
                id="nr_strada"
                name="nr_strada"
                type="number"
                value={formData.nr_strada}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="scara">Building</Label>
              <Input
                id="scara"
                name="scara"
                value={formData.scara}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apartament">Apartment</Label>
              <Input
                id="apartament"
                name="apartament"
                type="number"
                value={formData.apartament}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="telefon">Phone</Label>
              <Input
                id="telefon"
                name="telefon"
                value={formData.telefon}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profesie">Profession</Label>
              <Input
                id="profesie"
                name="profesie"
                value={formData.profesie}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="loc_de_munca">Workplace</Label>
              <Input
                id="loc_de_munca"
                name="loc_de_munca"
                value={formData.loc_de_munca}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sex">Sex</Label>
              <Select value={formData.sex} onValueChange={(value) => handleSelectChange('sex', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="grupa_sange">Blood Type</Label>
              <Select value={formData.grupa_sange} onValueChange={(value) => handleSelectChange('grupa_sange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="AB">AB</SelectItem>
                  <SelectItem value="O">O</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="rh">Rh Factor</Label>
              <Select value={formData.rh} onValueChange={(value) => handleSelectChange('rh', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Rh factor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pozitiv">Positive</SelectItem>
                  <SelectItem value="negativ">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Patient'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditPatientForm;
