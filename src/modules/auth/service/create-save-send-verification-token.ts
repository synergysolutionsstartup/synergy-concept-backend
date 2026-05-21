import { common } from "@src/common/_index";
import { authConstants } from "@src/modules/auth/constants";
import { sendVerificationEmail } from "@src/modules/auth/service/send-verification-email";
import { authUtils } from "@src/modules/auth/utils/_index";

const AppError = common.errors.AppError;

// THIS GENERATES A NEW VERIFICATION CODE
// SAVES IT TO THE DATABASE
// THEN SENDS THE CODE TO THE USER EMAIL
export const createSaveAndSendVerificationToken = async (
  email: string,
  firstName: string,
  id: string,
  updateVerificationToken: any
) => {
  const emailService = common.services.email;

  const verificationCode = authUtils.generateOTP();
  if (!verificationCode) {
    console.error("Verification code generation failed");
    throw new AppError(
      "Unable to process verification request due to a server error. Please try again later."
    );
  }

  const updatePayload = {
    verificationToken: verificationCode,
    verificationTokenExpiresAt: new Date(
      Date.now() + authConstants.otpExpiry.verification
    ),
  };
  const updateResult = await updateVerificationToken(id, updatePayload);
  if (updateResult.error) {
    throw new AppError(authConstants.authMessage.serverError);
  }

  const verifyEmailPayload = {
    token: verificationCode,
    userEmail: email,
    getEmailTemplate: authUtils.buildVerificationEmail,
    sendEmail: emailService.sendSingleRecipient,
    senderName: authConstants.mailProps.appName ?? "BizFlow",
    senderEmail: authConstants.mailProps.appEmail ?? "no-reply@bizflow.com",
  };

  const mailResult = await sendVerificationEmail(verifyEmailPayload);
  if (mailResult.error) {
    throw new AppError(authConstants.authMessage.serverError, 500);
  }
};
