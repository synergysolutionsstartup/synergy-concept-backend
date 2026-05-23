import mongoose from "mongoose";
import { SchoolInfoTypes } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { SchoolModel } from "@src/database/mongoose/models/school.model";

const { DatabaseError } = Errors;

type SchoolInfoEntity = SchoolInfoTypes.Entities.SchoolInfoEntity;
type NewSchoolInfoRecord = SchoolInfoTypes.Records.NewSchoolInfoRecord;
type UpdateSchoolInfoRecord = SchoolInfoTypes.Records.UpdateSchoolInfoRecord;

type DbClient = typeof mongoose;

const normalizeDocument = <T extends Record<string, any>>(doc: T | null): T | null => {
  if (!doc) return null;
  const normalized = { ...doc } as any;
  if (normalized._id !== undefined) {
    normalized.id = String(normalized._id);
  }
  delete normalized._id;
  delete normalized.__v;
  return normalized as T;
};

const normalizeDocuments = <T extends Record<string, any>>(docs: T[]): T[] =>
  docs.map((doc) => normalizeDocument(doc) as T);

export function SchoolInfoDao(mongoClient: DbClient, parseDbError: any) {
  return {
    async createSchoolInfo(ownerId: string, payload: NewSchoolInfoRecord): Promise<SchoolInfoEntity> {
      try {
        const payloadData = { ...payload, userId: ownerId };
        const result = await SchoolModel.findOneAndUpdate(
          { userId: ownerId },
          payloadData,
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        ).lean({ virtuals: true });
        return normalizeDocument(result) as SchoolInfoEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async updateSchoolInfo(updates: UpdateSchoolInfoRecord): Promise<SchoolInfoEntity | null> {
      try {
        const { id, ...data } = updates;
        const result = await SchoolModel.findOneAndUpdate({ id }, data, {
          new: true,
        }).lean({ virtuals: true });
        return normalizeDocument(result) as SchoolInfoEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findById(id: string): Promise<SchoolInfoEntity | null> {
      try {
        const result = await SchoolModel.findOne({ id }).lean({ virtuals: true });
        return normalizeDocument(result) as SchoolInfoEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findByUserId(userId: string): Promise<SchoolInfoEntity | null> {
      try {
        const result = await SchoolModel.findOne({ userId }).lean({ virtuals: true });
        return normalizeDocument(result) as SchoolInfoEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findFirst(filters?: Partial<Record<string, any>>): Promise<SchoolInfoEntity | null> {
      try {
        const result = await SchoolModel.findOne(filters || {}).lean({ virtuals: true });
        return normalizeDocument(result) as SchoolInfoEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
  };
}
