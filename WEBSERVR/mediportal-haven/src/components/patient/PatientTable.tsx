import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, FileText, Edit, Trash2, RefreshCw, Pill } from "lucide-react";
import { hasPermission } from '@/utils/permissions';
import PatientDetailsModal from './PatientDetailsModal';
import EditPatientForm from './EditPatientForm';
import PrescriptionDetailsModal from './PrescriptionDetailsModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Patient, APIPatient } from '@/types/patient';
import type { UserRole } from '@/utils/permissions';
import type { APIPrescription } from '@/types/prescription';

type PatientTableProps = {
  patients: Patient[];
  onViewPatient: (patientId: number) => void;
  onCreatePrescription: (patient: Patient) => void;
  onPatientUpdate: (updatedPatient: Patient) => void;
  onRemovePatient: (patientId: number) => void;
  userRole: UserRole;
};

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onViewPatient,
  onCreatePrescription,
  onPatientUpdate,
  onRemovePatient,
  userRole
}) => {
  const { toast } = useToast();
  const isReceptionist = hasPermission(userRole, 'assign_beds');
  const isDoctor = hasPermission(userRole, 'manage_patients');
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPrescriptionDetailsModalOpen, setIsPrescriptionDetailsModalOpen] = useState(false);
  const [selectedPatientForPrescriptions, setSelectedPatientForPrescriptions] = useState<Patient | null>(null);
  const [isDeletingPatient, setIsDeletingPatient] = useState<number | null>(null);
  const [patientPrescriptions, setPatientPrescriptions] = useState<{[key: string]: APIPrescription[]}>({});

  useEffect(() => {
    fetchAllPrescriptions();
  }, []);

  const fetchAllPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const authToken = localStorage.getItem('authToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      const finalToken = authToken || token;
      
      if (!finalToken) return;

      const response = await fetch('http://132.220.27.51/prescriptii/', {
        method: 'GET',
        headers: {
          'Authorization': `${tokenType} ${finalToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const prescriptions: APIPrescription[] = await response.json();
        const prescriptionsByPatient: {[key: string]: APIPrescription[]} = {};
        
        prescriptions.forEach(prescription => {
          if (!prescriptionsByPatient[prescription.CNP]) {
            prescriptionsByPatient[prescription.CNP] = [];
          }
          prescriptionsByPatient[prescription.CNP].push(prescription);
        });
        
        setPatientPrescriptions(prescriptionsByPatient);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const handleViewPatient = (patient: Patient) => {
    console.log("Viewing patient data:", patient);
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    console.log("Editing patient data:", patient);
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handlePatientUpdate = (updatedPatient: Patient) => {
    onPatientUpdate(updatedPatient);
    setIsEditModalOpen(false);
    setSelectedPatient(null);
  };
  
  const handleDeletePatient = async (patient: Patient) => {
    if (!patient.CNP) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot delete patient without CNP"
      });
      return;
    }
    
    setIsDeletingPatient(patient.id);
    
    try {
      const token = localStorage.getItem('token');
      const authToken = localStorage.getItem('authToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      const finalToken = authToken || token;
      
      if (!finalToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You need to be logged in to delete patients"
        });
        return;
      }

      console.log(`Deleting patient with CNP ${patient.CNP}`);
      const response = await fetch(`http://132.220.27.51/angajati/medic/${patient.CNP}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${tokenType} ${finalToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete patient: ${response.status}`);
      }

      onRemovePatient(patient.id);
      
      toast({
        title: "Patient Removed",
        description: `${patient.prenume} ${patient.nume} has been removed successfully`
      });
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete patient. Please try again."
      });
    } finally {
      setIsDeletingPatient(null);
    }
  };

  const handleViewPrescriptions = (patient: Patient) => {
    setSelectedPatientForPrescriptions(patient);
    setIsPrescriptionDetailsModalOpen(true);
  };

  const getPrescriptionCount = (cnp: string | undefined) => {
    if (!cnp) return 0;
    return patientPrescriptions[cnp]?.length || 0;
  };
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Bed ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Prescriptions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.nume}, {patient.prenume}</TableCell>
                  <TableCell>{patient.room || 'Not assigned'}</TableCell>
                  <TableCell>{patient.id_pat || 'N/A'}</TableCell>
                  <TableCell>
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
                      {patient.patientState}
                    </span>
                  </TableCell>
                  <TableCell>{patient.grupa_sange || 'Unknown'}</TableCell>
                  <TableCell>
                    <button
                      className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 cursor-pointer"
                      onClick={() => handleViewPrescriptions(patient)}
                    >
                      {getPrescriptionCount(patient.CNP)} prescriptions
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPatient(patient)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      
                      {isDoctor && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => onCreatePrescription(patient)}
                        >
                          <Pill className="w-4 h-4 mr-1" />
                          Prescribe
                        </Button>
                      )}
                      
                      {(isReceptionist || isDoctor) && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPatient(patient)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      
                      {(isReceptionist || isDoctor) && (
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePatient(patient)}
                          disabled={isDeletingPatient === patient.id}
                        >
                          {isDeletingPatient === patient.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No patients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PatientDetailsModal 
        patient={selectedPatient} 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <PrescriptionDetailsModal
        isOpen={isPrescriptionDetailsModalOpen}
        onClose={() => setIsPrescriptionDetailsModalOpen(false)}
        patientCNP={selectedPatientForPrescriptions?.CNP || ''}
        patientName={selectedPatientForPrescriptions ? `${selectedPatientForPrescriptions.prenume} ${selectedPatientForPrescriptions.nume}` : ''}
      />

      {isEditModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditPatientForm 
            patient={selectedPatient}
            onPatientUpdate={handlePatientUpdate}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default PatientTable;
