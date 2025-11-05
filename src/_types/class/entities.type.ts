// CLASS ENTITY FILE

export enum ClassName {
  JSS_ONE = "JSS_ONE",
  JSS_TWO = "JSS_TWO",
  JSS_THREE = "JSS_THREE",
  SSS_ONE = "SSS_ONE",
  SSS_TWO = "SSS_TWO",
  SSS_THREE = "SSS_THREE",
}


// ------------------ ENTITY ------------------
export interface SectionEntity {
  id: string;
  classId: string;
  section: string;
  createdAt: Date;
  updatedAt: Date;
}

// ------------------ ENTITY ------------------
export interface ClassEntity {
  id: string;
  schoolId: string;
  
  name: ClassName;
  sections: SectionEntity[];

  createdAt: Date;
  updatedAt: Date;
}
