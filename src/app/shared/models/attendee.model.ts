export interface Attendee {
  id?: string;
  age: number;
  firstName: string;
  lastName: string;
  mobile: number;
  sex: string;
  school?: string;
  invitedBy?: string;
  isFirstTimer: boolean;
}

export interface UniteAttendee extends Attendee {
  leader?: string;
  claimedFood?: boolean;
  district?: string;
  facebookAcc?: string;
  ticketNo: string;
}
