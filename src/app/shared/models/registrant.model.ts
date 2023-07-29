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
  mobile: number;
  birthdate: string;
  sex: string;
  school?: string;
  district?: string;
  isFirstTimer?: boolean;
  claimedFood: boolean;
}
