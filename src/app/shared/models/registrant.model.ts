import { Timestamp } from "firebase/firestore";

export interface Registrant {
  lastName: string;
  firstName: string;
  mobile: number;
  birthdate: string;
  sex: string;
  school?: string;
  invitedBy?: string;
  leader: string;
  signature: string;
  isFirstTimer: boolean;
}

export interface UniteRegistrant {
  docId?: string;
  firstName: string;
  lastName: string;
  facebookAcc?: string;
  mobile: number;
  birthdate: string;
  sex: string;
  school?: string;
  district?: string;
  ticketNo: string;
  isFirstTimer?: boolean;
  leader?: string;
  claimedFood: boolean;
  created_at: Timestamp;
  timestamp?: Date;
}
