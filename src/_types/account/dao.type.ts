import { UserRole } from "@src/_types/account/enums.type";
import { AccountEntity } from "@src/_types/account/entities.type";
import {
  NewAccountRecord,
  UpdateAccountRecord,
} from "@src/_types/account/records.type";

// ------------------ DAO TYPES ------------------
export interface AuthDaoType {
  createAccount(payload: NewAccountRecord): Promise<AccountEntity>;
  updateAccount(
    id: string,
    payload: UpdateAccountRecord
  ): Promise<AccountEntity | null>;
  deleteAccount(id: string): Promise<AccountEntity | null>;
  findAccountById(id: string): Promise<AccountEntity | null>;
  findAccountByEmail(email: string): Promise<AccountEntity | null>;
  readAdminAccounts(): Promise<AccountEntity[]>;
  readAccountsByRoles(roles: string[]): Promise<AccountEntity[]>;
  approveManyAdmins(ids: string[]): Promise<AccountEntity[]>;
}

// To be used for creating admins, teachers, etc. and managing accounts
export interface AdminAuthDaoType {
  readAdminAccounts(role: UserRole): Promise<AccountEntity[]>;
  createMany(payload: NewAccountRecord[]): Promise<AccountEntity[]>;
  updateMany(payload: UpdateAccountRecord[]): Promise<AccountEntity[]>;
  deleteMany(payload: string[]): Promise<AccountEntity[]>;
}
