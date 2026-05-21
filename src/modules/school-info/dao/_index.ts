// src/modules/school-info/dao/_index.ts

import { SchoolInfoTypes as SchoolInfo } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { db } from "@src/database/_index/index";
import { SchoolModel } from "@src/database/mongoose/models/school.model";

type NewSchoolInfoRecord = SchoolInfo.Records.NewSchoolInfoRecord;
type UpdateSchoolInfoRecord = SchoolInfo.Records.UpdateSchoolInfoRecord;
type SchoolInfoEntity = SchoolInfo.Entities.SchoolInfoEntity;

const { DatabaseError } = Errors;

const normalizeSchoolDocument = <T extends Record<string, any>>(doc: T | null): T | null => {
  if (!doc) return null;
  const normalized = { ...doc } as any;
  if (normalized._id !== undefined) {
    normalized.id = String(normalized._id);
  }
  delete normalized._id;
  delete normalized.__v;
  return normalized as T;
};

type DbClient = typeof db.dbClient;

export function SchoolInfoDao(dbClient: DbClient, parseDbError: any) {
  return {
    // ✅ Create or update SchoolInfo by ownerId
    async createSchoolInfo(
      ownerId: string,
      payload: NewSchoolInfoRecord
    ): Promise<SchoolInfoEntity> {
      try {
        const { userId, ...payloadWithoutUserId } = payload;
        const result = await SchoolModel.findOneAndUpdate(
          { userId: ownerId },
          { userId: ownerId, ...payloadWithoutUserId },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        ).lean();

        return normalizeSchoolDocument(result) as unknown as SchoolInfoEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Update
    async updateSchoolInfo(
      updates: UpdateSchoolInfoRecord
    ): Promise<SchoolInfo.Entities.SchoolInfoEntity | null> {
      try {
        const { id, ...data } = updates;
        const result = await SchoolModel.findByIdAndUpdate(id, data, {
          new: true,
        })
          .lean();
        return normalizeSchoolDocument(result) as unknown as SchoolInfoEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by ID
    async findById(id: string): Promise<SchoolInfoEntity | null> {
      try {
        const result = await SchoolModel.findById(id).lean();
        return normalizeSchoolDocument(result) as unknown as SchoolInfoEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by userId
    async findByUserId(userId: string): Promise<SchoolInfoEntity | null> {
      try {
        const result = await SchoolModel.findOne({ userId }).lean();
        return normalizeSchoolDocument(result) as unknown as SchoolInfoEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findFirst(): Promise<SchoolInfoEntity | null> {
      try {
        const result = await SchoolModel.findOne().lean();
        return normalizeSchoolDocument(result) as unknown as SchoolInfoEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
  };
}
