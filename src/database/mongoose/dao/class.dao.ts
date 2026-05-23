import mongoose from "mongoose";
import { ClassTypes, SchoolInfoTypes } from "@src/_types/_index";
import { Errors } from "@src/common/error/_index";
import { ClassModel } from "@src/database/mongoose/models/class.model";
import { SchoolModel } from "@src/database/mongoose/models/school.model";

const { DatabaseError } = Errors;

type NewClassRecord = ClassTypes.Records.NewClassRecord;
type UpdateRecord = ClassTypes.Records.UpdateClassRecord;
type ClassEntity = ClassTypes.Entities.ClassEntity;
type SchoolInfoEntity = SchoolInfoTypes.Entities.SchoolInfoEntity;

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

export function ClassDao(mongoClient: DbClient, parseDbError: any) {
  return {
    async create(payload: NewClassRecord): Promise<ClassEntity> {
      try {
        const existingClass = await ClassModel.findOne({
          schoolId: payload.schoolId,
          name: payload.name,
        }).lean({ virtuals: true });

        if (existingClass) {
          throw new DatabaseError(
            "Class with name already exist. Please use another class name",
            400,
            null
          );
        }

        const classId = new mongoose.Types.ObjectId().toHexString();
        const classDoc = new ClassModel({
          id: classId,
          schoolId: payload.schoolId,
          name: payload.name,
          sections: payload.sections.map((section) => ({
            id: new mongoose.Types.ObjectId().toHexString(),
            classId,
            section,
          })),
        });

        const result = await classDoc.save();
        return normalizeDocument(result.toObject()) as ClassEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async update(updates: UpdateRecord): Promise<ClassEntity | null> {
      try {
        const classDoc = await ClassModel.findOne({ id: updates.id });
        if (!classDoc) {
          return null;
        }

        if (updates.name) {
          classDoc.name = updates.name;
        }

        if (updates.sections) {
          const existingSections = classDoc.sections || [];
          const existingSectionNames = existingSections.map((section) => section.section);
          const newSectionNames = updates.sections || [];

          const retainedSections = existingSections.filter((section) =>
            newSectionNames.includes(section.section)
          );

          const toAdd = newSectionNames.filter(
            (section) => !existingSectionNames.includes(section)
          );

          const addedSections = toAdd.map((section) => ({
            id: new mongoose.Types.ObjectId().toHexString(),
            classId: classDoc.id,
            section,
          }));

          classDoc.sections = [...retainedSections, ...addedSections];
        }

        const result = await classDoc.save();
        return normalizeDocument(result.toObject()) as ClassEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async remove(id: string): Promise<ClassEntity | null> {
      try {
        const result = await ClassModel.findOneAndDelete({ id }).lean({
          virtuals: true,
        });
        return normalizeDocument(result) as ClassEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findById(id: string): Promise<ClassEntity | null> {
      try {
        const result = await ClassModel.findOne({ id })
          .lean({ virtuals: true });
        return normalizeDocument(result) as ClassEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findAll(schoolId: string): Promise<ClassEntity[] | null> {
      try {
        const result = await ClassModel.find({ schoolId })
          .lean({ virtuals: true });
        return normalizeDocuments(result) as ClassEntity[];
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findOne(filters: Partial<Record<string, any>>): Promise<ClassEntity | null> {
      try {
        const result = await ClassModel.findOne(filters).lean({ virtuals: true });
        return normalizeDocument(result) as ClassEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    async findSchool(id: string): Promise<SchoolInfoEntity | null> {
      try {
        const result = await SchoolModel.findOne({ id })
          .lean({ virtuals: true });
        return normalizeDocument(result) as SchoolInfoEntity | null;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
  };
}
