import { deleteSessionController } from "@src/modules/session/controllers/delete-session.controller";
import { readSessionInfoController } from "@src/modules/session/controllers/read-session-info.controller";
import { readSessionsController } from "@src/modules/session/controllers/read-sessions.controller";
import { saveSessionController } from "@src/modules/session/controllers/save-session.controller";
import { updateSessionController } from "@src/modules/session/controllers/update-session.controller";

export function SessionController() {
  return {
    save: saveSessionController,
    update: updateSessionController,
    read: readSessionsController,
    readInfo: readSessionInfoController,
    remove: deleteSessionController
  };
}
