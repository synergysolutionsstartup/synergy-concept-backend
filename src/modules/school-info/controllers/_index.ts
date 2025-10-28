import { readSchoolInfoController } from "@src/modules/school-info/controllers/read-school-info.controller";
import { saveSchoolInfoController } from "@src/modules/school-info/controllers/save-school-info.controller";

export function SchoolInfoController() {
  return {
    save: saveSchoolInfoController,
    read: readSchoolInfoController,
  };
}
