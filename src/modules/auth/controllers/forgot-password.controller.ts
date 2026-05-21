import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { authConstants } from "@src/modules/auth/constants";
import { authUtils } from "@src/modules/auth/utils/_index";

const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;

type ForgotPasswordDto = AccountTypes.Dtos.ForgotPasswordDto;

interface Props {
  body: ForgotPasswordDto;
  dao: any;
}

export const forgotPasswordController = async (props: Props) => {
  try {
    const { body, dao } = props;
    const { findAccountByEmail, updateAccount } = dao;
    const { authMessage } = authConstants;
    const { services } = common;

    const user = await findAccountByEmail(body.email);
    if (!user) {
      throw new AppError(authMessage.userNotFound, 400);
    }

    const resetCode = authUtils.generateOTP();
    if (!resetCode) {
      console.error("Password reset code generation failed");
      throw new AppError(authMessage.serverError, 500);
    }

    await updateAccount(user.id, {
      passwordResetToken: resetCode,
      passwordResetTokenExpiresAt: new Date(
        Date.now() + authConstants.otpExpiry.passwordReset
      ),
    });

    const emailPayload = authUtils.buildPasswordResetEmail(body.email, resetCode);
    const mailResult = await services.email.sendSingleRecipient({
      senderName: authConstants.mailProps.appName ?? "BizFlow",
      senderEmail: authConstants.mailProps.appEmail ?? "no-reply@bizflow.com",
      subject: emailPayload.subject,
      body: emailPayload.html,
      destEmail: body.email,
    });

    if (mailResult.error) {
      console.error("forgotPassword email send failed", mailResult.error);
      throw new AppError(authMessage.serverError, 500);
    }

    return {
      status: "success",
      message: "A password reset code has been sent to your email address.",
      data: null,
    };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }
    throw new AppError(authConstants.authMessage.serverError, 500);
  }
};
