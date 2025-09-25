import { BloodGroup, Sex, UserRole } from './types';

export const BLOOD_GROUPS = Object.values(BloodGroup);
export const SEX_OPTIONS = Object.values(Sex);
export const USER_ROLES = Object.values(UserRole);
export const URGENCY_LEVELS: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
