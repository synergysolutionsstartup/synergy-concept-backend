// src/modules/school-info/dao/_index.ts

import { SchoolInfoTypes, SessionTypes as Session } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { db, Prisma } from "@src/database/_index/index";

type NewSessionRecord = Session.Records.NewSessionRecord;
type UpdateRecord = Session.Records.UpdateSessionRecord;
type SessionEntity = Session.Entities.SessionEntity;

const { DatabaseError } = Errors;

type DbClient = typeof db.dbClient;

export function SessionDao(prismaClient: DbClient, parseDbError: any) {
  return {
    // ✅ Create Session
    async create(payload: NewSessionRecord): Promise<SessionEntity> {
      try {
        const result = await prismaClient.session.create({
          data: payload,
        });
        // console.log("create result ", result)
        return result as unknown as SessionEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        //  console.log("create error ", error)
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Update
    async update(
      updates: UpdateRecord
    ): Promise<Session.Entities.SessionEntity | null> {
      try {
        // console.log("UpdateRecord payload ", updates)
        const { id, ...data } = updates;
        const result = (await prismaClient.session.update({
          where: { id },
          data: data,
        })) as Prisma.SessionUncheckedCreateInput;
        // console.log("update result ", result)
        return result as unknown as SessionEntity;
      } catch (error) {
        // console.log("update error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // Delete session
    async remove(id: string): Promise<SessionEntity[] | null> {
      try {
        const result = await prismaClient.session.delete({
          where: { id },
        });
        // console.log("remove result ", result)
        return result as unknown as SessionEntity[];
      } catch (error) {
        // console.log("remove Error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by ID: returns a session information
    async findById(id: string): Promise<SessionEntity | null> {
      try {
        const result = await prismaClient.session.findUnique({
          where: { id },
        });
        return result as unknown as SessionEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find all sessions
    async findAll(schoolId: string): Promise<SessionEntity[] | null> {
      try {
        const result = await prismaClient.session.findMany({
          where: { schoolId },
        });
        // console.log("find result ", result)
        return result as unknown as SessionEntity[];
      } catch (error) {
        // console.log("findSessionByUserId Error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ------------------ Find one session with dynamic filters ------------------
    async findOne(
      filters: Partial<Prisma.SessionWhereInput>
    ): Promise<SessionEntity | null> {
      try {
        const result = await prismaClient.session.findFirst({
          where: filters,
        });
        return result as unknown as SessionEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
  };
}
