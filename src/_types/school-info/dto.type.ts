import { SchoolInfoEntity } from "@src/_types/school-info/entities.type";

// ------------------ DTO TYPES ------------------

export interface CreateSchoolInfoDTO
  extends Omit<SchoolInfoEntity, "createdAt" | "updatedAt" | "userId" | "id"> {}

export interface UpdateSchoolInfoDTO extends Partial<CreateSchoolInfoDTO> {
  id: string;
}

