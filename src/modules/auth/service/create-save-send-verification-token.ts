import { common } from "@src/common/_index";
import { authConstants } from "@src/modules/auth/constants";
import { sendVerificationEmail } from "@src/modules/auth/service/send-verification-email";
import { authUtils } from "@src/modules/auth/utils/_index";

const AppError =   common.errors.AppError;

// THIS GENERATES A NEW VERIFICTION TOKEN
// SAVES IT TO THE DATABASE
// THEN SENDS THE TOKEN TO THE USER E-MAIL
export const createSaveAndSendVerificationToken = async (
  email: string,
  firstName: string,
  id: string,
  updateVerificationToken: any
) => {
  const emailService = common.services.email;
  const { signJwtToken } = common.utils.tokens;
  const { jwtExpiry, jwtKeys } = common.constants;

  // USE THE EMAIL OF THE USER TO CREATE A verifyJwtToken string
  const verifyJWTPayload = { email };
  const verifyJwtToken = signJwtToken(
    verifyJWTPayload,
    jwtKeys.auth,
    jwtKeys,
    jwtExpiry,
    true
  );

  if (verifyJwtToken.error || !verifyJwtToken.data) {
    throw new AppError(authConstants.authMessage.serverError);
  }
  // save the newly generated verificationToken to the db
  const updatePayload = { verificationToken: verifyJwtToken.data };
  const updateResult = await updateVerificationToken(id, updatePayload);
  if (updateResult.error) {
    throw new AppError(authConstants.authMessage.serverError);
  }

  // SEND THE VERIFICATION EMAIL
  const verifyEmailPayload = {
    constants: authConstants,
    token: verifyJwtToken.data,
    userFirstName: firstName,
    userEmail: email,
    getEmailTemplate: authUtils.getEmailTemplate,
    sendEmail: emailService.sendSingleRecipient,
  };
  // NEXT SEND EMAIL TO THE USER CONTAINEING THE GENERATED VERIFICATION LINK
  const mailResult = await sendVerificationEmail(
    verifyEmailPayload
  );

  if (mailResult.error) {
    throw new AppError(authConstants.authMessage.serverError, 500);
  }
};
