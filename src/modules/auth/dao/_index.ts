// src/modules/auth/dao/auth.dao.ts

import { AccountTypes as Account } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { db, Prisma } from "@src/database/_index/index";

type NewAccountRecord = Account.Records.NewAccountRecord;
type UpdateAccountRecord = Account.Records.UpdateAccountRecord;
type AccountEntity = Account.Entities.AccountEntity;
type SuperAdminProfileEntity = Account.Entities.SuperAdminProfileEntity;

const { DatabaseError } = Errors;

type DbClient = typeof db.dbClient;

function parseDbError(error: any) {
  switch (error?.code) {
    case "P2002":
      return { message: "Unique constraint failed", statusCode: 409 };
    case "P2025":
      return { message: "Record not found", statusCode: 404 };
    default:
      return { message: "Database error", statusCode: 500 };
  }
}

export function AuthDao(prismaClient: DbClient) {
  const Prisma = db.Prisma;

  return {
    // ✅ Create Account + Profile
    async createAccount(payload: NewAccountRecord): Promise<AccountEntity> {
      try {
        const { role, ...accountData } = payload;
        // console.log("NewAccountRecord ", payload)

        if (role !== Account.Enums.UserRole.SuperAdmin) {
          const message = "Only Super Admin signup is allowed here.";
          throw new DatabaseError(message, 400);
        }

        // Run all steps in a single transaction
        const result = await prismaClient.$transaction(
          async (tx) => {
            const defaultUserId = `N/A_${Date.now()}`;

            // Step 1: Create default school
            const defaultSchool = await tx.school.create({
              data: {
                name: "N/A",
                email: "N/A", // optional — for reference
                address: "N/A",
                country: "N/A",
                state: "N/A",
                phoneNumber1: "N/A",
                userId: defaultUserId, // link admin as school owner
              },
            });

            // Step 2: Create the Super Admin user
            const createdAccount = await tx.user.create({
              data: {
                ...accountData,
                role,
                schoolId: defaultSchool.id,
                superAdminProfile: { create: payload.superAdminProfile },
              } as unknown as any,
              include: { superAdminProfile: true },
            });

            // Step 3: update the userId of the school with the id of the newly created user
            // so you can retrive it later on
            const updatedSchool = await tx.school.update({
              where: { userId: defaultUserId },
              data: { userId: createdAccount.id },
            });
            const returnData = {
              ...createdAccount,
              schoolId: updatedSchool.id
            }
            return returnData;
          },
          {
            timeout: 30000, // 30 seconds
          }
        );

        return result as AccountEntity;
      } catch (error) {
        console.log("db error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Update
    async updateAccount(
      id: string,
      updates: UpdateAccountRecord
    ): Promise<Account.Entities.AccountEntity | null> {
      try {
        // console.log("updateAccount payload ", updates)
        const result = (await prismaClient.user.update({
          where: { id },
          data: updates as any,
          include: {
            studentProfile: true,
            staffProfile: true,
            parentProfile: true,
            superAdminProfile: true,
          },
        })) as Prisma.UserUncheckedCreateInput;
        // console.log("updateAccount result ", result)
        return result as unknown as AccountEntity;
      } catch (error) {
        console.log("updateAccount error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Delete
    async deleteAccount(id: string): Promise<AccountEntity | null> {
      try {
        const result = await prismaClient.user.delete({
          where: { id },
          include: {
            studentProfile: true,
            staffProfile: true,
            parentProfile: true,
            superAdminProfile: true,
          },
        });

        return result as unknown as AccountEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by ID
    async findAccountById(id: string): Promise<AccountEntity | null> {
      try {
        const result = await prismaClient.user.findUnique({
          where: { id },
          include: {
            studentProfile: true,
            staffProfile: true,
            parentProfile: true,
            superAdminProfile: true,
          },
        });

        return result as unknown as AccountEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by Email
    async findAccountByEmail(email: string): Promise<AccountEntity | null> {
      try {
        const result = await prismaClient.user.findUnique({
          where: { email },
          include: {
            studentProfile: true,
            staffProfile: true,
            parentProfile: true,
            superAdminProfile: true,
          },
        });

        // console.log("findAccountByEmail result ", result)
        return result as unknown as AccountEntity;
      } catch (error) {
        console.log("findAccountByEmail Error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
  };
}
