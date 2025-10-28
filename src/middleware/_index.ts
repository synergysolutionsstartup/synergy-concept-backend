
import { handleSessionAuth } from "@src/middleware/handle-authorization";
import { handleGlobalErrors } from "@src/middleware/handle-global-errors";
import { handleInvalidRoute } from "@src/middleware/handle-invalid-route";
import { validateDto } from "@src/middleware/validate-dto";


export const middlewares = {
  validateDto,
  handleGlobalErrors,
  handleInvalidRoute,
  handleSessionAuth
};
