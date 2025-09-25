
export enum BloodGroup {
  APositive = 'A+',
  ANegative = 'A-',
  BPositive = 'B+',
  BNegative = 'B-',
  ABPositive = 'AB+',
  ABNegative = 'AB-',
  OPositive = 'O+',
  ONegative = 'O-',
}

export enum Sex {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum UserRole {
  Requestor = 'Requestor',
  Volunteer = 'Volunteer',
  Both = 'Both',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  sex: Sex;
  locality: string;
  role: UserRole;
  donations: number;
}

export interface Donation {
  id: string;
  donorId: string;
  requestId: string;
  donationDate: Date;
  patientName: string;
}

export interface BloodRequest {
  id: string;
  requestorId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  locality: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Matched' | 'Closed';
  createdAt: Date;
}