import { AccountTypes as Account } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { UserModel } from "@src/database/mongoose/models/user.model";
import mongoose from "mongoose";

type NewAccountRecord = Account.Records.NewAccountRecord;
type UpdateAccountRecord = Account.Records.UpdateAccountRecord;
type AccountEntity = Account.Entities.AccountEntity;

type DbClient = typeof mongoose;

const { DatabaseError } = Errors;

const normalizeDocument = <T extends Record<string, any>>(doc: T | null): T | null => {
  if (!doc) return null;
  const normalized = { ...doc } as any;
  if (normalized._id !== undefined) {
    normalized.id = String(normalized._id);
  }
  delete normalized._id;
  delete normalized.__v;
  return normalized as T;
};

const normalizeDocuments = <T extends Record<string, any>>(docs: T[]): T[] =>
  docs.map((doc) => normalizeDocument(doc) as T);

function buildProfileData(payload: NewAccountRecord) {
  if (payload.role === Account.Enums.UserRole.Admin) {
    if (!payload.adminProfile) {
      throw new DatabaseError("adminProfile is required for admin account", 400);
    }
    return { adminProfile: payload.adminProfile };
  }

  if (payload.role === Account.Enums.UserRole.Student) {
    if (!payload.studentProfile) {
      throw new DatabaseError("studentProfile is required for student account", 400);
    }
    return { studentProfile: payload.studentProfile };
  }

  if (payload.role === Account.Enums.UserRole.Staff) {
    if (!payload.staffProfile) {
      throw new DatabaseError("staffProfile is required for staff account", 400);
    }
    return { staffProfile: payload.staffProfile };
  }

  if (payload.role === Account.Enums.UserRole.Parent) {
    if (!payload.parentProfile) {
      throw new DatabaseError("parentProfile is required for parent account", 400);
    }
    return { parentProfile: payload.parentProfile };
  }

  if (payload.role === Account.Enums.UserRole.SuperAdmin) {
    if (!payload.superAdminProfile) {
      throw new DatabaseError(
        "superAdminProfile is required for super admin account",
        400
      );
    }
    return { superAdminProfile: payload.superAdminProfile };
  }

  throw new DatabaseError("Invalid user role", 400);
}

export function AccountDao(mongoClient: DbClient, parseDbError: any) {
  return {
    async createAccount(payload: NewAccountRecord): Promise<AccountEntity> {
      const session = await mongoClient.startSession();
      try {
        const { role, ...accountData } = payload;
        if (
          role !== Account.Enums.UserRole.Admin &&
          role !== Account.Enums.UserRole.Student &&
          role !== Account.Enums.UserRole.Staff &&
          role !== Account.Enums.UserRole.Parent &&
          role !== Account.Enums.UserRole.SuperAdmin
        ) {
          throw new DatabaseError(
            "Invalid role for account creation.",
            400
          );
        }

        let createdUser: any = null;
        await session.withTransaction(async () => {
          const profileData = buildProfileData(payload);

          const userPayload = {
            ...accountData,
            role,
            schoolId: accountData.schoolId ?? "NA",
            verified: accountData.verified ?? false,
            isApproved:
              role === Account.Enums.UserRole.Admin ? false : true,
            refreshToken: accountData.refreshToken ?? null,
            verificationToken: accountData.verificationToken ?? null,
            passwordResetToken: accountData.passwordResetToken ?? null,
          };

          const user = new UserModel(userPayload);
          const userId = user._id.toHexString();

          const normalizedProfileData = Object.keys(profileData).reduce(
            (acc, key) => {
              const profile = (profileData as any)[key];
              if (profile) {
                acc[key] = { ...profile, userId };
              }
              return acc;
            },
            {} as Record<string, any>
          );

          Object.assign(user, normalizedProfileData);
          createdUser = await user.save({ session });
        });

        return normalizeDocument(createdUser.toObject()) as AccountEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      } finally {
        session.endSession();
      }
    },

    async updateAccount(
      id: string,
      updates: UpdateAccountRecord
    ): Promise<AccountEntity | null> {
      try {
        const result = await UserModel.findByIdAndUpdate(id, updates, {
          new: true,
        }).lean({ virtuals: true });

        return normalizeDocument(result) as AccountEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async readAdminAccounts(): Promise<AccountEntity[]> {
      try {
        const result = await UserModel.find({
          role: Account.Enums.UserRole.Admin,
        })
          .lean({ virtuals: true });
        return normalizeDocuments(result) as AccountEntity[];
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async readAccountsByRoles(roles: string[]): Promise<AccountEntity[]> {
      try {
        const result = await UserModel.find({
          role: { $in: roles },
        })
          .lean({ virtuals: true });
        return normalizeDocuments(result) as AccountEntity[];
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async approveManyAdmins(ids: string[]): Promise<AccountEntity[]> {
      try {
        await UserModel.updateMany(
          {
            _id: { $in: ids },
            role: Account.Enums.UserRole.Admin,
          },
          { isApproved: true }
        );

        const result = await UserModel.find({
          _id: { $in: ids },
          role: Account.Enums.UserRole.Admin,
        })
          .lean({ virtuals: true });

        return normalizeDocuments(result) as AccountEntity[];
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async deleteAccount(id: string): Promise<AccountEntity | null> {
      try {
        const result = await UserModel.findByIdAndDelete(id).lean({ virtuals: true });
        return normalizeDocument(result) as AccountEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findAccountById(id: string): Promise<AccountEntity | null> {
      try {
        const result = await UserModel.findById(id).lean({ virtuals: true });
        return normalizeDocument(result) as AccountEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findAccountByEmail(email: string): Promise<AccountEntity | null> {
      try {
        const result = await UserModel.findOne({ email }).lean({ virtuals: true });
        return normalizeDocument(result) as AccountEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
  };
}
