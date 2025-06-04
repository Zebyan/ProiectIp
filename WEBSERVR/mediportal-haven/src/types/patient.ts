
export type PatientSex = 'M' | 'F' | 'Other' | 'Male' | 'Female';
export type BloodType = 'A' | 'B' | 'AB' | 'O';
export type PatientState = 'Stable' | 'Critical' | 'Improving' | 'Worsening' | 'Emergency';
export type RhFactor = 'pozitiv' | 'negativ';

export type Patient = {
  id: number;
  CNP?: string;
  nume: string;
  prenume: string;
  judet: string;
  localitate: string;
  strada: string;
  nr_strada: number;
  scara: string;
  apartament: number;
  telefon: string;
  email: string;
  profesie: string;
  loc_de_munca: string;
  patientState: PatientState;
  id_pat: string;
  sex: PatientSex;
  grupa_sange: string;
  rh: RhFactor;
  admissionDate: string;
  prescriptions: PrescriptionInfo[];
  room?: string;
};

export type PrescriptionInfo = {
  id: number;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  notes: string;
};

export type APIPatient = {
  CNP: string;
  nume: string;
  prenume: string;
  judet: string;
  localitate: string;
  strada: string;
  nr_strada: number;
  scara: string;
  apartament: number;
  telefon: string;
  email: string;
  profesie: string;
  loc_de_munca: string;
  sex: string;
  grupa_sange: string;
  rh: string;
  id_pat: string;
};

export type NewPatient = {
  CNP: string;
  nume: string;
  prenume: string;
  judet: string;
  localitate: string;
  strada: string;
  nr_strada: string;
  scara: string;
  apartament: string;
  telefon: string;
  email: string;
  profesie: string;
  loc_de_munca: string;
  patientState: PatientState;
  id_pat: string;
  sex: PatientSex;
  grupa_sange: string;
  rh: RhFactor;
  admissionDate: string;
};

export type NewPrescription = Omit<PrescriptionInfo, 'id'>;
