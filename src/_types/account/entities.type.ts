import { StaffSubRole, UserRole } from "@src/_types/account/enums.type";

// ------------------ ACCOUNT ENTITY ------------------
export interface AccountEntity {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  schoolId: string;
  verified: boolean;
  isApproved: boolean;
  refreshToken?: string | null;
  verificationToken?: string | null;
  verificationTokenExpiresAt?: Date | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // relations
  adminProfile?: AdminProfileEntity | null;
  studentProfile?: StudentProfileEntity | null;
  staffProfile?: StaffProfileEntity | null;
  parentProfile?: ParentProfileEntity | null;
  superAdminProfile?: SuperAdminProfileEntity | null;
}

export interface AdminProfileEntity {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ------------------ PROFILES ------------------
export interface StudentProfileEntity {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender?: string | null;
  dob?: Date | null;
  parents?: string | null;
  currentClass?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffProfileEntity {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  department?: string | null;
  hireDate?: Date | null;
  subRoles: StaffSubRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentProfileEntity {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  children?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuperAdminProfileEntity {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  office?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
