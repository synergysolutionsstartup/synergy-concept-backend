import { emailService } from "@src/adapters/email/_index";
import { tokens } from "@src/adapters/token/_index";
import { validator } from "@src/adapters/validator/_index";

import * as hash from "@src/adapters/hash/password";

export const adapters = {
  tokens,
  validator,
  emailService,
  hash,
};
