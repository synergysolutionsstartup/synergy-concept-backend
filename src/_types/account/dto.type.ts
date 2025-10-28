import { AccountEntity } from "@src/_types/account/entities.type";

// ------------------ DTO TYPES ------------------
export type CreateAccountDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginDto = Pick<AccountEntity, "email" | "password">;

export interface VerifyAcountDto {
  token: string;
}

export type UpdateAccountDto = Partial<AccountEntity>;

export interface AccountResponseDTO
  extends Omit<AccountEntity, "password" | "refreshToken" | "verificationToken"> {}
