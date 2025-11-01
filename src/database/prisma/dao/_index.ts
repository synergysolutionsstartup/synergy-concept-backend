
import { dbClient } from "@src/database/prisma/connection";
import { AccountDao } from "@src/database/prisma/dao/account.dao";
type DbClient = typeof dbClient;
export interface AppDaoShape {
  account: ReturnType<typeof AccountDao>;
}

export type AppDaoFactory = (
  client: DbClient,
  parseDbError: any
) => AppDaoShape;



export const AppDao = (client: DbClient, parseDbError: any) => {
  let _account: ReturnType<typeof AccountDao>;

  return {
    get account() {
      if (!_account) _account = AccountDao(client, parseDbError);
      return _account;
    },
  };
};
