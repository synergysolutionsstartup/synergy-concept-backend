import { AccountEntity } from "@src/_types/account/entities.type";

// ------------------ DTO TYPES ------------------
export type SignupDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type CreateSuperAdminDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type CreateAccountDto = {
  role: "admin" | "staff" | "student" | "parent";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subRoles?: Array<"class_teacher" | "subject_teacher">;
};

export type LoginDto = Pick<AccountEntity, "email" | "password">;

export interface VerifyAcountDto {
  email: string;
  token: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  password: string;
}

export type UpdateAccountDto = Partial<AccountEntity>;

export interface AccountResponseDTO
  extends Omit<
    AccountEntity,
    | "password"
    | "refreshToken"
    | "verificationToken"
    | "verificationTokenExpiresAt"
    | "passwordResetToken"
    | "passwordResetTokenExpiresAt"
  > {}
