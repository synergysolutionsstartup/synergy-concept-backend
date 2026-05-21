import { AccountTypes as Account } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { db } from "@src/database/_index/index";

import { AccountDao as MongooseAccountDao } from "@src/database/mongoose/dao/account.dao";

type NewAccountRecord = Account.Records.NewAccountRecord;
type UpdateAccountRecord = Account.Records.UpdateAccountRecord;
type AccountEntity = Account.Entities.AccountEntity;

const { DatabaseError } = Errors;

type DbClient = typeof db.dbClient;

export function AuthDao(mongoClient: DbClient, parseDbError: any) {
  return MongooseAccountDao(mongoClient, parseDbError);
}
