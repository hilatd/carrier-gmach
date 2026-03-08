export type RequestStatus = "open" | "pending" | "handled" | "closed";
export type ActionStatus = "open" | "lending" | "returned" | "waiting_list" | "closed";
export type CarrierTypes =
  | "backpack"
  | "woven_wrap"
  | "elastic"
  | "mei_dai"
  | "rings"
  | "accessories"
  | "other";
export type CarrierState = "good" | "damaged" | "for_sell" | "maintenance";

export interface Client {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
}

export interface Volunteer {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  imageUrl: string;
  bio: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
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
  deletedAt: number | null;
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
  model: string;
  color: string;
  state: CarrierState;
  volunteerId: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}
