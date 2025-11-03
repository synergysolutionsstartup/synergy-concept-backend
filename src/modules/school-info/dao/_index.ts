// src/modules/school-info/dao/_index.ts

import { SchoolInfoTypes as SchoolInfo } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { db, Prisma } from "@src/database/_index/index";

type NewSchoolInfoRecord = SchoolInfo.Records.NewSchoolInfoRecord;
type UpdateSchoolInfoRecord = SchoolInfo.Records.UpdateSchoolInfoRecord;
type SchoolInfoEntity = SchoolInfo.Entities.SchoolInfoEntity;

const { DatabaseError } = Errors;

type DbClient = typeof db.dbClient;



export function SchoolInfoDao(prismaClient: DbClient, parseDbError: any) {
  const Prisma = db.Prisma;

  return {
    // ✅ Create SchoolInfo
    async createSchoolInfo(
      ownerId: string,
      payload: NewSchoolInfoRecord
    ): Promise<SchoolInfoEntity> {
      try {
        // Single create call

        const result = (await prismaClient.school.update({
          where: { userId: ownerId },
          data: payload,
        })) as Prisma.SchoolUncheckedCreateInput;

        // const result = await prismaClient.school.update({
        //   data: payload as Prisma.SchoolUncheckedCreateInput,
        // });
        // console.log("createSchoolInfo result ", result)
        return result as unknown as SchoolInfoEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        //  console.log("createSchoolInfo error ", error)
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Update
    async updateSchoolInfo(
      updates: UpdateSchoolInfoRecord
    ): Promise<SchoolInfo.Entities.SchoolInfoEntity | null> {
      try {
        // console.log("UpdateSchoolInfoRecord payload ", updates)

        const { id, ...data } = updates;
        const result = (await prismaClient.school.update({
          where: { id },
          data: data,
        })) as Prisma.SchoolUncheckedCreateInput;
        // console.log("updateSchoolInfo result ", result)
        return result as unknown as SchoolInfoEntity;
      } catch (error) {
        // console.log("updateSchoolInfo error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by ID
    async findById(id: string): Promise<SchoolInfoEntity | null> {
      try {
        const result = await prismaClient.school.findUnique({
          where: { id },
        });
        return result as unknown as SchoolInfoEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by userId
    async findByUserId(userId: string): Promise<SchoolInfoEntity | null> {
      try {
        const result = await prismaClient.school.findUnique({
          where: { userId },
        });
        // console.log("findSchoolInfoByEmail result ", result)
        return result as unknown as SchoolInfoEntity;
      } catch (error) {
        // console.log("findSchoolInfoByUserId Error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
  };
}
