import { deleteClassController } from "@src/modules/class/controllers/delete-class.controller";
import { readClassInfoController } from "@src/modules/class/controllers/read-class-info.controller";
import { readClassesController } from "@src/modules/class/controllers/read-class.controller";
import { saveClassController } from "@src/modules/class/controllers/save-class.controller";
import { updateClassController } from "@src/modules/class/controllers/update-class.controller";

export function ClassController() {
  return {
    save: saveClassController,
    update: updateClassController,
    read: readClassesController,
    readInfo: readClassInfoController,
    remove: deleteClassController
  };
}
