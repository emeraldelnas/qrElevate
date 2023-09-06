export interface Attendee {
  id?: string;
  age: number;
  firstName: string;
  lastName: string;
  sex: string;
  school?: string;
  invitedBy?: string;
  isFirstTimer: boolean;
}

export interface UniteAttendee extends Attendee {
  claimedFood: boolean;
  district: string;
  school: string;
}
