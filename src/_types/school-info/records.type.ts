import { SchoolInfoEntity } from "@src/_types/school-info/entities.type";

export interface NewSchoolInfoRecord
  extends Omit<SchoolInfoEntity, "createdAt" | "updatedAt" | "id"> {}


  export interface UpdateSchoolInfoRecord extends Partial<NewSchoolInfoRecord> {
    id: string;
  }
  // export type UpdateSchoolInfoRecord = Partial<NewSchoolInfoRecord>;

  
