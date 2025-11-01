// src/modules/auth/dao/auth.dao.ts

import { AccountTypes as Account } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { db, } from "@src/database/_index/index";
type AccountEntity = Account.Entities.AccountEntity

const { DatabaseError } = Errors;
type DbClient = typeof db.dbClient

export function AccountDao(prismaClient: DbClient, parseDbError: any) {

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
