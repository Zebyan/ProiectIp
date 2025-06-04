
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pill, X } from "lucide-react";
import type { APIPrescription } from '@/types/prescription';

type PrescriptionDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patientCNP: string;
  patientName: string;
};

const PrescriptionDetailsModal: React.FC<PrescriptionDetailsModalProps> = ({
  isOpen,
  onClose,
  patientCNP,
  patientName
}) => {
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<APIPrescription[]>([]);
  const [medications, setMedications] = useState<{[key: number]: {denumire: string}}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patientCNP) {
      fetchPrescriptions();
      fetchMedications();
    }
  }, [isOpen, patientCNP]);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
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
        const allPrescriptions: APIPrescription[] = await response.json();
        const patientPrescriptions = allPrescriptions.filter(p => p.CNP === patientCNP);
        setPrescriptions(patientPrescriptions);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch prescriptions"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem('token');
      const authToken = localStorage.getItem('authToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      const finalToken = authToken || token;
      
      if (!finalToken) return;

      const response = await fetch('http://132.220.27.51/medicamente/', {
        method: 'GET',
        headers: {
          'Authorization': `${tokenType} ${finalToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const medicationsData = await response.json();
        const medicationsMap = medicationsData.reduce((acc: any, med: any) => {
          acc[med.id_medicament] = { denumire: med.denumire };
          return acc;
        }, {});
        setMedications(medicationsMap);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Prescriptions for {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading prescriptions...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No prescriptions found for this patient.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((prescription) => (
                <div key={prescription.id_prescriptie} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Prescription ID</h4>
                      <p className="text-sm">{prescription.id_prescriptie}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Medication</h4>
                      <p className="text-sm">
                        {medications[prescription.id_medicament]?.denumire || `ID: ${prescription.id_medicament}`}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Quantity</h4>
                      <p className="text-sm">{prescription.cantitate}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Condition</h4>
                      <p className="text-sm">{prescription.afectiune || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionDetailsModal;
