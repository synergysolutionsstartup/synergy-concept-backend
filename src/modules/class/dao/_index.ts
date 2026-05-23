import { SchoolInfoTypes, ClassTypes as Class } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { db } from "@src/database/_index/index";
import { ClassDao as MongoClassDao } from "@src/database/mongoose/dao/class.dao";

type NewClassRecord = Class.Records.NewClassRecord;
type UpdateRecord = Class.Records.UpdateClassRecord;
type ClassEntity = Class.Entities.ClassEntity;

type SchoolInfoEntity = SchoolInfoTypes.Entities.SchoolInfoEntity;
const { DatabaseError } = Errors;
type DbClient = typeof db.dbClient;

export function ClassDao(dbClient: DbClient, parseDbError: any) {
  return MongoClassDao(dbClient, parseDbError);
}
