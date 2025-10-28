import { AccountDao } from "@src/common/dao/account.dao";
import { db } from "@src/database/_index/index";

type DbClient = typeof db.dbClient;
export const AppDao = (client: DbClient) => {
  const accountDao = AccountDao(client);
  return {
    account: accountDao,
  };
};
