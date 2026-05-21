import {
  generateOTP,
  getEmailTemplate,
  hasMinutesPassed,
} from "@src/modules/auth/utils/core.utils";
import {
  buildPasswordResetEmail,
  buildVerificationEmail,
} from "@src/modules/auth/utils/email-templates";

export const authUtils = {
  generateOTP,
  getEmailTemplate,
  hasMinutesPassed,
  buildPasswordResetEmail,
  buildVerificationEmail,
};
