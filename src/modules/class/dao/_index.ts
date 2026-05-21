// src/modules/school-info/dao/_index.ts

import { SchoolInfoTypes, ClassTypes as Class } from "@src/_types/_index";

import { Errors } from "@src/common/error/_index";
import { db, Prisma } from "@src/database/_index/index";

type NewClassRecord = Class.Records.NewClassRecord;
type UpdateRecord = Class.Records.UpdateClassRecord;
type ClassEntity = Class.Entities.ClassEntity;

type SchoolInfoEntity = SchoolInfoTypes.Entities.SchoolInfoEntity;
const { DatabaseError } = Errors;
type DbClient = typeof db.dbClient;

export function ClassDao(prismaClient: DbClient, parseDbError: any) {
  return {
    // ✅ Create Class
    async create(payload: NewClassRecord): Promise<ClassEntity> {
      const { schoolId, name, sections } = payload;
      try {
        // console.log("createClass dao payload", payload)
        let message = "";
        const result = await prismaClient.$transaction(
          async (tx: any) => {
            // 1️⃣ Find baseclass
            let baseClass = await tx.class.findUnique({
              where: { schoolId_name: { schoolId, name } },
            });

            // if baseClass is nonExistemt then create it first
            if (baseClass) {
              message =
                "Class with name already exist. Please use another class name";
              throw new DatabaseError(message, 400, null);
            }

            console.log("base class does not exit: creating new one");
            baseClass = await tx.class.create({
              data: { name, schoolId },
            });

            // 2️⃣ Create multiple sections for this base class
            const createdSections = await tx.classSection.createMany({
              data: sections.map((item) => ({
                classId: baseClass.id,
                section: item,
              })),
              skipDuplicates: true, // prevent duplicate section entries
            });
            console.log("created sections ", createdSections);

            // 3️⃣ Fetch all sections of this class to return full objects
            const sectionRecords = await tx.classSection.findMany({
              where: { classId: baseClass.id },
            });
            console.log("section Records ", sectionRecords);

            const data = {
              ...baseClass,
              sections: sectionRecords,
            }; // 3️⃣ Return combined data for convenience

            return data as unknown as ClassEntity;
          },
          {
            timeout: 30000, // 30 seconds
          }
        );

        return result;
      } catch (error) {
        console.log("create error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Update
    async update(updates: UpdateRecord): Promise<ClassEntity | null> {
      try {
        const { id, ...rest } = updates;
        const { sections, name } = rest;

        console.log("update dao payload ", updates);

        const result = await prismaClient.$transaction(
          async (tx: any) => {
            // 1️⃣ Update basic class info (if any field like `name` is provided)
            if (name) {
              await tx.class.update({
                where: { id },
                data: { name },
              });
            }

            // 2️⃣ Fetch current sections for the class
            const existingSections = await tx.classSection.findMany({
              where: { classId: id },
              select: { section: true },
            });

            const existingSectionNames = existingSections.map((s: any) => s.section);

            // 3️⃣ Determine which sections to delete and which to add
            const newSectionNames = sections || [];
            const toDelete = existingSectionNames.filter(
              (section: any) => !newSectionNames.includes(section)
            );
            const toAdd = newSectionNames.filter(
              (section: any) => !existingSectionNames.includes(section)
            );

            // 4️⃣ Delete old sections not in new array
            if (toDelete.length > 0) {
              await tx.classSection.deleteMany({
                where: {
                  classId: id,
                  section: { in: toDelete },
                },
              });
            }

            // 5️⃣ Add new sections
            if (toAdd.length > 0) {
              const newSections = toAdd.map((section) => ({
                classId: id,
                section,
              }));
              await tx.classSection.createMany({ data: newSections });
            }

            // 6️⃣ Fetch updated sections and return full class data
            const classWithSections = await tx.class.findUnique({
              where: { id },
              include: { sections: true },
            });

            return classWithSections as unknown as ClassEntity;
          },
          {
            timeout: 30000, // 30 seconds
          }
        );

        return result;
      } catch (error) {
        console.log("updateDao Error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },
    // Delete Class
    async remove(id: string): Promise<ClassEntity[] | null> {
      try {
        console.log("classId", id);
        const result = await prismaClient.class.delete({
          where: { id },
        });
        // console.log("remove result ", result)
        return result as unknown as ClassEntity[];
      } catch (error) {
        console.log("remove dao Error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by ID: returns a Class information
    async findById(id: string): Promise<ClassEntity | null> {
      try {
        const result = await prismaClient.class.findUnique({
          where: { id },
          include: {
            sections: true,
          },
        });

        return result as unknown as ClassEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find all Classs
    async findAll(schoolId: string): Promise<ClassEntity[] | null> {
      try {
        const result = await prismaClient.class.findMany({
          where: { schoolId },
          include: {
            sections: true,
          },
        });
        // console.log("find result ", result)
        return result as unknown as ClassEntity[];
      } catch (error) {
        // console.log("findClassByUserId Error ", error);
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ------------------ Find one session with dynamic filters ------------------
    async findOne(
      filters: Partial<Prisma.ClassWhereInput>
    ): Promise<ClassEntity | null> {
      try {
        const result = await prismaClient.class.findFirst({
          where: filters,
        });
        return result as unknown as ClassEntity;
      } catch (error) {
        const { message, statusCode } = parseDbError(error);
        throw new DatabaseError(message, statusCode, error);
      }
    },

    // ✅ Find by ID: returns a School information
    async findSchool(id: string): Promise<SchoolInfoEntity | null> {
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
  };
}
