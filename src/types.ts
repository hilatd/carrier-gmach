export interface CarrierRequest {
  id?: string;
  parentName: string;
  phone: string;
  babyAge: string;
  carrierType: string;
  notes: string;
  status: "open" | "handled";
  createdAt: number;
}