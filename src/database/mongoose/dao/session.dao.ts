import mongoose from "mongoose";
import { SessionTypes } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { SessionModel } from "@src/database/mongoose/models/session.model";

const { DatabaseError } = Errors;

type NewSessionRecord = SessionTypes.Records.NewSessionRecord;
type UpdateRecord = SessionTypes.Records.UpdateSessionRecord;
type SessionEntity = SessionTypes.Entities.SessionEntity;

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

export function SessionDao(mongoClient: DbClient, parseDbError: any) {
  return {
    async create(payload: NewSessionRecord): Promise<SessionEntity> {
      try {
        const session = new SessionModel({
          ...payload,
        });
        const result = await session.save();
        return normalizeDocument(result.toObject()) as SessionEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async update(updates: UpdateRecord): Promise<SessionEntity | null> {
      try {
        const { id, ...data } = updates;
        const result = await SessionModel.findOneAndUpdate(
          { id },
          data,
          { new: true }
        ).lean({ virtuals: true });
        return normalizeDocument(result) as SessionEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async remove(id: string): Promise<SessionEntity | null> {
      try {
        const result = await SessionModel.findOneAndDelete({ id }).lean({
          virtuals: true,
        });
        return normalizeDocument(result) as SessionEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findById(id: string): Promise<SessionEntity | null> {
      try {
        const result = await SessionModel.findOne({ id }).lean({
          virtuals: true,
        });
        return normalizeDocument(result) as SessionEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findAll(schoolId: string): Promise<SessionEntity[] | null> {
      try {
        const result = await SessionModel.find({ schoolId }).lean({
          virtuals: true,
        });
        return normalizeDocuments(result) as SessionEntity[];
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findOne(filters: Partial<Record<string, any>>): Promise<SessionEntity | null> {
      try {
        const result = await SessionModel.findOne(filters).lean({
          virtuals: true,
        });
        return normalizeDocument(result) as SessionEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
  };
}
