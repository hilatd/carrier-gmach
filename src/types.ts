export type RequestStatus = "open" | "pending" | "handled" | "closed";
export type ActionStatus = "open" | "lending" | "returned" | "waiting_list" | "closed";
export type CarrierTypes = "ssc" | "wrap" | "ring_sling" | "mei_dai" | "backpack" | "blanket_coat" | "other";
export type CarrierState = "good" | "damaged" | "for_sell" | "maintenance";

export interface Client {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: number;
  updatedAt: number;
}

export interface Volunteer {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: number;
  updatedAt: number;
}

export interface CarrierRequest {
  id?: string;
  clientId: string;
  status: RequestStatus;
  notes: string;
  babyAge: string;
  babyWeight: string;
  carriersExperience: string;
  carriersRequested: string;
  source: string;
  handledBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface Action {
  id?: string;
  clientId: string;
  carrierId: string;
  takenFrom: string;
  lastContactBy: string;
  status: ActionStatus;
  OriginalDateReturn: number;
  dateReturned: number;
  additionalFee: number;
  totalFee: number;
  paid: boolean;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface Carrier {
  id?: string;
  type: CarrierTypes;
  brand: string;
  color: string;
  state: CarrierState;
  volunteerId: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}
