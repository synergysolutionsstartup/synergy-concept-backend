

// RECORDS TYPES FILE
import {
  StudentProfileEntity,
  StaffProfileEntity,
  ParentProfileEntity,
  SuperAdminProfileEntity,
  AccountEntity
} from "@src/_types/account/entities.type";

import { UserRole } from "@src/_types/account/enums.type";


// ------------------ PROFILE INPUTS ------------------
export type NewStudentProfileInput = Omit<
  StudentProfileEntity,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type NewStaffProfileInput = Omit<
  StaffProfileEntity,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type NewParentProfileInput = Omit<
  ParentProfileEntity,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type NewSuperAdminProfileInput = Omit<
  SuperAdminProfileEntity,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

// ------------------ ROLE-SPECIFIC ACCOUNT INPUTS ------------------
type NewAccountBase = {
  email: string;
  password: string;
  role: UserRole;

  verified?: boolean;
  refreshToken?: string | null;
  verificationToken?: string | null;
};

export type NewSuperAdminAccount = NewAccountBase & {
  role: UserRole.SuperAdmin;
  superAdminProfile: NewSuperAdminProfileInput;
};



export type NewStaffAccount = NewAccountBase & {
  role: UserRole.Staff;
  staffProfile: NewStaffProfileInput;
};

export type NewStudentAccount = NewAccountBase & {
  role: UserRole.Student;
  studentProfile: NewStudentProfileInput;
};

export type NewParentAccount = NewAccountBase & {
  role: UserRole.Parent;
  parentProfile: NewParentProfileInput;
};



export interface NewAccountRecord extends NewAccountBase {
  superAdminProfile?: NewSuperAdminProfileInput;
  staffProfile?: NewStaffProfileInput;
  studentProfile?: NewStudentProfileInput;
  parentProfile?: NewParentProfileInput;
}


  export type UpdateAccountRecord = Partial<AccountEntity>;


    // Note the dd when set to the NewAccountRecord does not have the profile information 
