// SESSION RECORD FILE

import { SessionEntity } from "@src/_types/session/entities.type";

export interface NewSessionRecord
  extends Omit<SessionEntity, "createdAt" | "updatedAt" | "id"> {}

interface UpdateSessionShape extends Omit<NewSessionRecord, "schoolId"> {}

export interface UpdateSessionRecord extends Partial<UpdateSessionShape> {
  id: string;
}
