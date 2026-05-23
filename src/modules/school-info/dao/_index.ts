import { SchoolInfoTypes as SchoolInfo } from "@src/_types/_index";
import { db } from "@src/database/_index/index";
import { SchoolInfoDao as MongoSchoolInfoDao } from "@src/database/mongoose/dao/school-info.dao";

type DbClient = typeof db.dbClient;

export function SchoolInfoDao(dbClient: DbClient, parseDbError: any) {
  return MongoSchoolInfoDao(dbClient, parseDbError);
}
