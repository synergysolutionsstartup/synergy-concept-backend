// SESSION ENTITY FILE

export enum Term {
  FIRST_TERM = "FIRST_TERM",
  SECOND_TERM = "SECOND_TERM",
  Third_TERM = "THIRD_TERM",
}

// ------------------ ENTITY ------------------
export interface SessionEntity {
  id: string;
  schoolId: string;
  year: string;
  term: Term;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
