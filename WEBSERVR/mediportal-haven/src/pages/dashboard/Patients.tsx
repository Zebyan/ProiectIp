import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientTable from "@/components/patient/PatientTable";
import AddPatientForm from "@/components/patient/AddPatientForm";
import CreatePrescriptionForm from "@/components/patient/CreatePrescriptionForm";
import { hasPermission } from "@/utils/permissions";
import type {
  Patient,
  NewPatient,
  PatientState,
  APIPatient,
} from "@/types/patient";
import type { UserRole } from "@/utils/permissions";

const Patients = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPatients, setIsFetchingPatients] = useState(false);

  // Define the state for new patient
  const [newPatient, setNewPatient] = useState<NewPatient>({
    CNP: "",
    nume: "",
    prenume: "",
    judet: "",
    localitate: "",
    strada: "",
    nr_strada: "",
    scara: "",
    apartament: "",
    telefon: "",
    email: "",
    profesie: "",
    loc_de_munca: "",
    patientState: "Stable",
    id_pat: "",
    sex: "M",
    grupa_sange: "O",
    rh: "pozitiv",
    admissionDate: new Date().toISOString().split("T")[0],
  });

  // Using strings for role checking to match the type in permissions.ts
  const currentUserRole: UserRole =
    (localStorage.getItem("userRole") as UserRole) || "Receptionist";
  const isReceptionist = hasPermission(currentUserRole, "assign_beds");
  const isDoctor = hasPermission(currentUserRole, "manage_patients");

  // Fetch all patients from API on component mount
  useEffect(() => {
    fetchAllPatients();
  }, []);

  // Function to fetch all patients from the API
  const fetchAllPatients = async () => {
    setIsFetchingPatients(true);
    try {
      const token = localStorage.getItem("token");
      const authToken = localStorage.getItem("authToken");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const finalToken = authToken || token;

      if (!finalToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You need to be logged in to view patients",
        });
        return;
      }

      console.log("Fetching patients from API...");
      const response = await fetch("http://132.220.27.51/angajati/medic/", {
        method: "GET",
        headers: {
          Authorization: `${tokenType} ${finalToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }

      const data: APIPatient[] = await response.json();
      console.log("Patients data received:", data);

      // Convert API patients to our Patient type
      const formattedPatients: Patient[] = data.map((patient, index) => ({
        id: index + 1, // Generate sequential IDs
        CNP: patient.CNP,
        nume: patient.nume,
        prenume: patient.prenume,
        judet: patient.judet,
        localitate: patient.localitate,
        strada: patient.strada,
        nr_strada: patient.nr_strada,
        scara: patient.scara,
        apartament: patient.apartament,
        telefon: patient.telefon,
        email: patient.email,
        profesie: patient.profesie,
        loc_de_munca: patient.loc_de_munca,
        sex: patient.sex as "M" | "F" | "Other",
        grupa_sange: patient.grupa_sange,
        rh: patient.rh as "pozitiv" | "negativ",
        id_pat: patient.id_pat,
        patientState: "Stable" as PatientState, // Default state since not available in API
        admissionDate: new Date().toISOString().split("T")[0], // Default date since not available in API
        prescriptions: [], // No prescriptions in API response
      }));

      setPatients(formattedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch patients. Please try again.",
      });
    } finally {
      setIsFetchingPatients(false);
    }
  };

  const filteredPatients = patients
    .filter((patient) => {
      const searchLower = searchTerm.toLowerCase();
      // Add null/undefined checks for each property
      return (
        (patient.nume || "").toLowerCase().includes(searchLower) ||
        (patient.prenume || "").toLowerCase().includes(searchLower) ||
        (patient.id_pat || "").toLowerCase().includes(searchLower) ||
        (patient.patientState || "").toLowerCase().includes(searchLower)
      );
    })
    .filter((patient) => {
      if (activeTab === "all") return true;
      if (activeTab === "critical")
        return (
          patient.patientState === "Critical" ||
          patient.patientState === "Emergency"
        );
      if (activeTab === "stable")
        return (
          patient.patientState === "Stable" ||
          patient.patientState === "Improving"
        );
      return true;
    });

  const handleAddPatient = async () => {
    if (
      !newPatient.nume ||
      !newPatient.prenume ||
      !newPatient.id_pat ||
      !newPatient.CNP
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get ALL authentication tokens from localStorage to ensure we have a valid one
      const token = localStorage.getItem("token");
      const authToken = localStorage.getItem("authToken");
      const finalToken = authToken || token;

      console.log("Auth check:", {
        hasToken: !!token,
        hasAuthToken: !!authToken,
        usingToken: !!finalToken,
        tokenPreview: finalToken
          ? finalToken.substring(0, 10) + "..."
          : "No token available",
      });

      if (!finalToken) {
        toast({
          title: "Authentication Error",
          description: "You are not logged in. Please log in again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Prepare the data for the API
      const patientData = {
        CNP: newPatient.CNP,
        nume: newPatient.nume,
        prenume: newPatient.prenume,
        judet: newPatient.judet,
        localitate: newPatient.localitate,
        strada: newPatient.strada,
        nr_strada: parseInt(newPatient.nr_strada) || 0,
        scara: newPatient.scara,
        apartament: parseInt(newPatient.apartament) || 0,
        telefon: newPatient.telefon,
        email: newPatient.email,
        profesie: newPatient.profesie,
        loc_de_munca: newPatient.loc_de_munca,
        sex: newPatient.sex,
        grupa_sange: newPatient.grupa_sange,
        rh: newPatient.rh,
        id_pat: newPatient.id_pat,
      };

      console.log("Sending patient data:", patientData);
      console.log(
        "Using authentication token:",
        finalToken.substring(0, 10) + "..."
      );

      // Send POST request to the API with BEARER token format instead of TOKEN format
      const response = await fetch("http://132.220.27.51/angajati/medic/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${finalToken}`,
        },
        body: JSON.stringify(patientData),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API Error Response:", errorData);

        // If we get a 401, that means our token is invalid, let's clear it and redirect to login
        if (response.status === 401) {
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          // Clear localStorage and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/login";
          return;
        }

        throw new Error(`Failed to add patient. Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      // Create a new patient object for the UI with additional fields
      const newPatientId = Math.max(...patients.map((p) => p.id), 0) + 1;
      const patientToAdd: Patient = {
        id: newPatientId,
        ...patientData,
        nr_strada: parseInt(newPatient.nr_strada) || 0,
        apartament: parseInt(newPatient.apartament) || 0,
        patientState: newPatient.patientState,
        admissionDate: newPatient.admissionDate,
        prescriptions: [],
      };

      setPatients([...patients, patientToAdd]);

      setNewPatient({
        CNP: "",
        nume: "",
        prenume: "",
        judet: "",
        localitate: "",
        strada: "",
        nr_strada: "",
        scara: "",
        apartament: "",
        telefon: "",
        email: "",
        profesie: "",
        loc_de_munca: "",
        patientState: "Stable",
        id_pat: "",
        sex: "M",
        grupa_sange: "O",
        rh: "pozitiv",
        admissionDate: new Date().toISOString().split("T")[0],
      });

      setIsAddPatientModalOpen(false);

      toast({
        title: "Patient Added",
        description: `${patientToAdd.prenume} ${patientToAdd.nume} has been added to bed ${patientToAdd.id_pat}`,
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error Adding Patient",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewPatient((prev) => ({ ...prev, [field]: value }));
  };

  const openPrescriptionModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPrescriptionModalOpen(true);
  };

  const handleCreatePrescription = (prescriptionData: any) => {
    console.log("Prescription created:", prescriptionData);
    setIsPrescriptionModalOpen(false);
    setSelectedPatient(null);

    toast({
      title: "Prescription Created",
      description: `Prescription created successfully for ${selectedPatient?.prenume} ${selectedPatient?.nume}`,
    });
  };

  const handlePatientUpdate = (updatedPatient: Patient) => {
    setPatients(
      patients.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );

    toast({
      title: "Patient Updated",
      description: `${updatedPatient.prenume} ${updatedPatient.nume} has been updated successfully`,
    });
  };

  const handleRemovePatientFromBed = (patientId: number) => {
    const patientToRemove = patients.find((p) => p.id === patientId);
    if (!patientToRemove) return;

    setPatients(patients.filter((p) => p.id !== patientId));

    toast({
      title: "Patient Removed",
      description: `${patientToRemove.prenume} ${patientToRemove.nume} has been removed from their bed`,
    });
  };

  const handleViewPatient = (patientId: number) => {
    // In a real app, this would navigate to a patient details page
    toast({
      title: "View Patient",
      description: `Viewing details for patient #${patientId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Patient Management</h2>
        <p className="text-gray-600 mt-1">
          Manage patient information, prescriptions, and medical records
        </p>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="stable">Stable</TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <Button
              onClick={fetchAllPatients}
              variant="outline"
              disabled={isFetchingPatients}
            >
              {isFetchingPatients ? "Refreshing..." : "Refresh Patients"}
            </Button>
            <Button
              onClick={() => setIsAddPatientModalOpen(true)}
              disabled={!isReceptionist && !isDoctor}
            >
              Add New Patient
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Patients</CardTitle>
                  <CardDescription>
                    Manage patient records and prescriptions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="patientSearch">Search Patients</Label>
                <Input
                  id="patientSearch"
                  placeholder="Search by name, bed ID, or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {isFetchingPatients ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading patients...</p>
                </div>
              ) : patients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No patients found. Add a new patient or refresh the list.
                  </p>
                </div>
              ) : (
                <PatientTable
                  patients={filteredPatients}
                  onViewPatient={handleViewPatient}
                  onCreatePrescription={openPrescriptionModal}
                  onPatientUpdate={handlePatientUpdate}
                  onRemovePatient={handleRemovePatientFromBed}
                  userRole={currentUserRole}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Critical Patients</CardTitle>
              <CardDescription>
                Patients requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientTable
                patients={filteredPatients.filter(
                  (patient) =>
                    patient.patientState === "Critical" ||
                    patient.patientState === "Emergency"
                )}
                onViewPatient={handleViewPatient}
                onCreatePrescription={openPrescriptionModal}
                onPatientUpdate={handlePatientUpdate}
                onRemovePatient={handleRemovePatientFromBed}
                userRole={currentUserRole}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stable" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Stable Patients</CardTitle>
              <CardDescription>
                Patients in stable or improving condition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientTable
                patients={filteredPatients.filter(
                  (patient) =>
                    patient.patientState === "Stable" ||
                    patient.patientState === "Improving"
                )}
                onViewPatient={handleViewPatient}
                onCreatePrescription={openPrescriptionModal}
                onPatientUpdate={handlePatientUpdate}
                onRemovePatient={handleRemovePatientFromBed}
                userRole={currentUserRole}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isAddPatientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddPatientForm
            newPatient={newPatient}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onAddPatient={() => {}} // Keep existing handleAddPatient
            onCancel={() => setIsAddPatientModalOpen(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      {isPrescriptionModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CreatePrescriptionForm
            patientCNP={selectedPatient.CNP || ""}
            patientName={`${selectedPatient.prenume} ${selectedPatient.nume}`}
            onCreatePrescription={handleCreatePrescription}
            onCancel={() => setIsPrescriptionModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Patients;
