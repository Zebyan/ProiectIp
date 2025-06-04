
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { hasPermission } from '@/utils/permissions';
import type { UserRole } from '@/utils/permissions';

// Sample data - in a real app this would come from your backend
const AVAILABLE_ROOMS = [
  { id: 'A', name: 'Ward A' },
  { id: 'B', name: 'Ward B' },
  { id: 'C', name: 'Ward C' },
  { id: 'ICU', name: 'Intensive Care Unit' },
  { id: 'ER', name: 'Emergency Room' },
  { id: 'RR', name: 'Recovery Room' },
];

type BedAssignmentProps = {
  patientId?: number;
  patientName?: string;
  onAssignmentComplete?: (data: { patientId: number, room: string, bedId: string }) => void;
  isReceptionist: boolean;
};

const PatientBedAssignment = ({ 
  patientId, 
  patientName,
  onAssignmentComplete,
  isReceptionist
}: BedAssignmentProps) => {
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [bedId, setBedId] = useState<string>('');
  
  // Simulated bed availability (in a real app, this would be fetched based on selected ward)
  const getAvailableBeds = (roomId: string) => {
    // This would normally be an API call
    const bedCount = roomId === 'ICU' ? 10 : roomId === 'ER' ? 8 : 20;
    return Array.from({ length: bedCount }, (_, i) => ({
      id: `${roomId}${i + 1}`,
      status: Math.random() > 0.7 ? 'Occupied' : 'Available'
    })).filter(bed => bed.status === 'Available');
  };
  
  const availableBeds = selectedRoom ? getAvailableBeds(selectedRoom) : [];
  
  const handleAssignBed = () => {
    if (!selectedRoom || !bedId) {
      toast({
        title: "Missing Information",
        description: "Please select both room and bed",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would save this to your backend
    toast({
      title: "Bed Assigned",
      description: `Patient assigned to ${selectedRoom}, Bed ${bedId}`
    });
    
    if (onAssignmentComplete && patientId) {
      onAssignmentComplete({
        patientId,
        room: selectedRoom,
        bedId
      });
    }
    
    // Reset form
    setSelectedRoom('');
    setBedId('');
  };
  
  // If user doesn't have permission, show nothing or a message
  if (!isReceptionist) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            You need receptionist permissions to assign beds to patients.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Assign Bed to Patient</CardTitle>
        <CardDescription>
          {patientName 
            ? `Assign ${patientName} to a room and bed` 
            : 'Assign a room and bed to a patient'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="room">Select Ward/Room</Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger id="room">
                <SelectValue placeholder="Select a ward or room" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROOMS.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="bed">Select Bed</Label>
            <Select 
              value={bedId} 
              onValueChange={setBedId}
              disabled={!selectedRoom || availableBeds.length === 0}
            >
              <SelectTrigger id="bed">
                <SelectValue placeholder={
                  !selectedRoom 
                    ? "Select a room first" 
                    : availableBeds.length === 0 
                    ? "No beds available" 
                    : "Select an available bed"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableBeds.map(bed => (
                  <SelectItem key={bed.id} value={bed.id}>
                    Bed {bed.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAssignBed}
            disabled={!selectedRoom || !bedId}
            className="w-full mt-2"
          >
            Assign Bed
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientBedAssignment;
