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
export type templateLables = "request" | "loan" | "waiting_list" | "after" | "other";

interface Entity {
  id?: string;
  comment: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
}
export interface Client extends Entity {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Volunteer extends Entity {
  name: string;
  phone: string;
  email: string;
  address: string;
  imageUrl: string;
  bio: string;
  isActive: boolean;
}

export interface CarrierRequest extends Entity {
  clientId: string;
  status: RequestStatus;
  notes: string;
  babyAge: string;
  babyWeight: string;
  carriersExperience: string;
  carriersRequested: string;
  source: string;
  handledBy: string;
}

export interface Action extends Entity {
  clientId: string;
  carrierId: string;
  takenFrom: string;
  returnedTo: string;
  lastContactBy: string;
  status: ActionStatus;
  OriginalDateReturn: number;
  dateReturned: number;
  dateTaken: number;
  additionalFee: number;
  totalFee: number;
  paid: boolean;
  notes: string;
}

export interface Carrier extends Entity {
  type: CarrierTypes;
  brand: string;
  model: string;
  color: string;
  state: CarrierState;
  volunteerId: string;
  notes: string;
  imageUrl: string;
}

export interface Template extends Entity {
  text: string;
  name: string;
  labels: templateLables[];
}
