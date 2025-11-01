import { SessionEntity } from "@src/_types/session/entities.type";

// ------------------ DTO TYPES ------------------

export interface CreateSessionDto
  extends Omit<
    SessionEntity,
    "createdAt" | "updatedAt" | "id" | "startDate" | "endDate" | "schoolId"
  > {
  startDate: string; // ✅ frontend sends this as string
  endDate: string; // ✅ frontend sends this as string
}

export interface UpdateSessionDTO extends Partial<CreateSessionDto> {
  id: string;
}
