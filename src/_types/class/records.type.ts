// Class RECORD FILE

import { ClassEntity } from "@src/_types/class/entities.type";

export interface NewClassRecord
  extends Omit<ClassEntity, "createdAt" | "updatedAt" | "id"| "sections"> {
    sections: string[]
  }

interface UpdateClassShape extends Omit<NewClassRecord, "schoolId"> {}
export interface UpdateClassRecord extends Partial<UpdateClassShape> {
  id: string;
}
