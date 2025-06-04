
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type MedicationTableProps = {
  medications: Medication[];
  onRefresh: () => void;
};

const MedicationTable: React.FC<MedicationTableProps> = ({ medications, onRefresh }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Medications List</h3>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.length > 0 ? (
              medications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell className="font-medium">{medication.id_medicament}</TableCell>
                  <TableCell>{medication.denumire}</TableCell>
                  <TableCell>{medication.stoc}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No medications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MedicationTable;
