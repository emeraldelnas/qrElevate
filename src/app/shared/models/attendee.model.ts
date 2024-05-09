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
  claimedFood?: boolean;
  district?: string;
  facebookAcc?: string;
  ticketNo: string;
}
