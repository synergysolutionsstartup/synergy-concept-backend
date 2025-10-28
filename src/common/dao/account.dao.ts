// src/modules/auth/dao/auth.dao.ts

import { AccountTypes as Account } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { db, } from "@src/database/_index/index";
type AccountEntity = Account.Entities.AccountEntity

const { DatabaseError } = Errors;
type DbClient = typeof db.dbClient

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

export function AccountDao(prismaClient: DbClient) {

  return {

    // ✅ Find by ID
    async findAccountById(id: string): Promise<AccountEntity | null> {
      try {
        
       const result =  await prismaClient.user.findUnique({
          where: { id },
          include: {
            studentProfile: true,
            staffProfile: true,
            parentProfile: true,
            superAdminProfile: true,
          },
        });

        return result  as unknown as AccountEntity
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by Email
    async findAccountByEmail(email: string): Promise<AccountEntity | null> {
      try {
      const result =   await prismaClient.user.findUnique({
          where: { email },
          include: {
            studentProfile: true,
            staffProfile: true,
            parentProfile: true,
            superAdminProfile: true,
          },
        });


        // console.log("findAccountByEmail result ", result)
        return result as unknown as AccountEntity
      } catch (error) {
        console.log("findAccountByEmail Error ", error)
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
  };
}
