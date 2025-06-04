
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Patient } from '@/types/patient';

type PatientDetailsModalProps = {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
};

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  if (!patient) return null;

  // Convert PatientSex values to display format
  const displaySex = () => {
    if (!patient.sex) return 'Not specified';
    
    if (patient.sex === 'M' || patient.sex === 'Male') return 'Male';
    if (patient.sex === 'F' || patient.sex === 'Female') return 'Female';
    return patient.sex;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Complete information about {patient.prenume} {patient.nume}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">CNP</h4>
            <p>{patient.CNP || 'Not provided'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Full Name</h4>
            <p>{patient.prenume || ''} {patient.nume || ''}</p>
          </div>

          <Separator className="col-span-2 my-2" />
          <h3 className="col-span-2 font-semibold">Address Information</h3>

          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">County</h4>
            <p>{patient.judet || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">City</h4>
            <p>{patient.localitate || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Street</h4>
            <p>{patient.strada || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Street Number</h4>
            <p>{patient.nr_strada || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Building</h4>
            <p>{patient.scara || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Apartment</h4>
            <p>{patient.apartament || '-'}</p>
          </div>

          <Separator className="col-span-2 my-2" />
          <h3 className="col-span-2 font-semibold">Contact Information</h3>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Phone</h4>
            <p>{patient.telefon || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
            <p>{patient.email || '-'}</p>
          </div>

          <Separator className="col-span-2 my-2" />
          <h3 className="col-span-2 font-semibold">Professional Information</h3>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Profession</h4>
            <p>{patient.profesie || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Workplace</h4>
            <p>{patient.loc_de_munca || '-'}</p>
          </div>

          <Separator className="col-span-2 my-2" />
          <h3 className="col-span-2 font-semibold">Medical Information</h3>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Patient State</h4>
            <p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                patient.patientState === 'Critical' || patient.patientState === 'Emergency'
                  ? 'bg-red-100 text-red-800'
                  : patient.patientState === 'Stable'
                  ? 'bg-green-100 text-green-800'
                  : patient.patientState === 'Improving'
                  ? 'bg-blue-100 text-blue-800'
                  : patient.patientState === 'Worsening'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {patient.patientState || 'Unknown'}
              </span>
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Sex</h4>
            <p>{displaySex()}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Blood Type</h4>
            <p>{patient.grupa_sange || '-'} {patient.rh || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Bed ID</h4>
            <p>{patient.id_pat || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Room</h4>
            <p>{patient.room || '-'}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Admission Date</h4>
            <p>{patient.admissionDate || '-'}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailsModal;
