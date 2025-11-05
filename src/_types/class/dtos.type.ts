import { ClassEntity } from "@src/_types/class/entities.type";

// ------------------ DTO TYPES ------------------

export interface CreateClassDto
  extends Omit<ClassEntity, "createdAt" | "updatedAt" | "id"| "sections"> {
    sections: string[]
  }

interface UpdateClassShape extends Omit<CreateClassDto, "schoolId"> {}
export interface UpdateClassDTO extends Partial<UpdateClassShape> {
  id: string;
}

