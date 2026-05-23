import { SessionTypes as Session } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { db } from "@src/database/_index/index";
import { SessionDao as MongoSessionDao } from "@src/database/mongoose/dao/session.dao";

type NewSessionRecord = Session.Records.NewSessionRecord;
type UpdateRecord = Session.Records.UpdateSessionRecord;
type SessionEntity = Session.Entities.SessionEntity;

const { DatabaseError } = Errors;

type DbClient = typeof db.dbClient;

export function SessionDao(dbClient: DbClient, parseDbError: any) {
  return MongoSessionDao(dbClient, parseDbError);
}
