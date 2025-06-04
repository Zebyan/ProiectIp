
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NewPatient } from '@/types/patient';

type AddPatientFormProps = {
  newPatient: NewPatient;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string, value: string) => void;
  onAddPatient: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const AddPatientForm: React.FC<AddPatientFormProps> = ({
  newPatient,
  onInputChange,
  onSelectChange,
  onAddPatient,
  onCancel,
  isLoading = false
}) => {
  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">Add New Patient</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="CNP">CNP (Personal Numeric Code) *</Label>
          <Input
            id="CNP"
            name="CNP"
            value={newPatient.CNP}
            onChange={onInputChange}
            placeholder="CNP"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="nume">Last Name (Nume) *</Label>
          <Input
            id="nume"
            name="nume"
            value={newPatient.nume}
            onChange={onInputChange}
            placeholder="Last name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="prenume">First Name (Prenume) *</Label>
          <Input
            id="prenume"
            name="prenume"
            value={newPatient.prenume}
            onChange={onInputChange}
            placeholder="First name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="judet">County (Judet)</Label>
          <Input
            id="judet"
            name="judet"
            value={newPatient.judet}
            onChange={onInputChange}
            placeholder="County"
          />
        </div>
        
        <div>
          <Label htmlFor="localitate">City/Town (Localitate)</Label>
          <Input
            id="localitate"
            name="localitate"
            value={newPatient.localitate}
            onChange={onInputChange}
            placeholder="City/Town"
          />
        </div>
        
        <div>
          <Label htmlFor="strada">Street (Strada)</Label>
          <Input
            id="strada"
            name="strada"
            value={newPatient.strada}
            onChange={onInputChange}
            placeholder="Street"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="nr_strada">Street Number (Nr. Strada)</Label>
            <Input
              id="nr_strada"
              name="nr_strada"
              type="number"
              value={newPatient.nr_strada}
              onChange={onInputChange}
              placeholder="Number"
            />
          </div>
          
          <div>
            <Label htmlFor="scara">Building (Scara)</Label>
            <Input
              id="scara"
              name="scara"
              value={newPatient.scara}
              onChange={onInputChange}
              placeholder="Building"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="apartament">Apartment (Apartament)</Label>
          <Input
            id="apartament"
            name="apartament"
            type="number"
            value={newPatient.apartament}
            onChange={onInputChange}
            placeholder="Apartment number"
          />
        </div>
        
        <div>
          <Label htmlFor="telefon">Phone (Telefon)</Label>
          <Input
            id="telefon"
            name="telefon"
            value={newPatient.telefon}
            onChange={onInputChange}
            placeholder="Phone number"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={newPatient.email}
            onChange={onInputChange}
            placeholder="Email address"
          />
        </div>
        
        <div>
          <Label htmlFor="profesie">Profession (Profesie)</Label>
          <Input
            id="profesie"
            name="profesie"
            value={newPatient.profesie}
            onChange={onInputChange}
            placeholder="Profession"
          />
        </div>
        
        <div>
          <Label htmlFor="loc_de_munca">Workplace (Loc de Muncă)</Label>
          <Input
            id="loc_de_munca"
            name="loc_de_munca"
            value={newPatient.loc_de_munca}
            onChange={onInputChange}
            placeholder="Workplace"
          />
        </div>
        
        <div>
          <Label htmlFor="patientState">Patient State *</Label>
          <Select 
            value={newPatient.patientState} 
            onValueChange={(value) => onSelectChange('patientState', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select patient state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Stable">Stable</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Improving">Improving</SelectItem>
              <SelectItem value="Worsening">Worsening</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="id_pat">Bed ID (ID Pat) *</Label>
          <Input
            id="id_pat"
            name="id_pat"
            value={newPatient.id_pat}
            onChange={onInputChange}
            placeholder="Bed ID"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="sex">Sex</Label>
          <Select 
            value={newPatient.sex} 
            onValueChange={(value) => onSelectChange('sex', value)}
          >
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
          <Label htmlFor="grupa_sange">Blood Type (Grupa Sange)</Label>
          <Select 
            value={newPatient.grupa_sange} 
            onValueChange={(value) => onSelectChange('grupa_sange', value)}
          >
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
          <Label htmlFor="rh">RH Factor</Label>
          <Select 
            value={newPatient.rh} 
            onValueChange={(value) => onSelectChange('rh', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select RH factor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pozitiv">Positive</SelectItem>
              <SelectItem value="negativ">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="admissionDate">Admission Date</Label>
          <Input
            id="admissionDate"
            name="admissionDate"
            type="date"
            value={newPatient.admissionDate}
            onChange={onInputChange}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onAddPatient} disabled={isLoading}>
          {isLoading ? "Adding Patient..." : "Add Patient"}
        </Button>
      </div>
    </div>
  );
};

export default AddPatientForm;
