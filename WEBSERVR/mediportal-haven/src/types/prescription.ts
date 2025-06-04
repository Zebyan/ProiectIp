
export type Prescription = {
  id_prescriptie: number;
  cantitate: string;
  CNP: string;
  afectiune?: string;
  id_medicament: number;
};

export type NewPrescription = {
  id_prescriptie: number;
  cantitate: string;
  CNP: string;
  afectiune?: string;
  id_medicament: number;
};

export type APIPrescription = {
  id_prescriptie: number;
  cantitate: string;
  CNP: string;
  afectiune: string;
  id_medicament: number;
};
