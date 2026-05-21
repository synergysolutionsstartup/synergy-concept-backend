import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { authConstants } from "@src/modules/auth/constants";

const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;

type ResetPasswordDto = AccountTypes.Dtos.ResetPasswordDto;

interface Props {
  body: ResetPasswordDto;
  dao: any;
}

export const resetPasswordController = async (props: Props) => {
  try {
    const { body, dao } = props;
    const { findAccountByEmail, updateAccount } = dao;
    const { authMessage } = authConstants;
    const { hash } = common.utils;

    const user = await findAccountByEmail(body.email);
    if (!user) {
      throw new AppError(authMessage.userNotFound, 400);
    }

    if (
      !user.passwordResetToken ||
      !user.passwordResetTokenExpiresAt ||
      new Date(user.passwordResetTokenExpiresAt) < new Date() ||
      body.token !== user.passwordResetToken
    ) {
      throw new AppError("Invalid or expired password reset code. Please request a new reset code.", 400);
    }

    const hashedResult = await hash.hashPassword(body.password);
    if (hashedResult.error || !hashedResult.data) {
      console.error("Password hashing failed", hashedResult.error);
      throw new AppError(authMessage.serverError, 500);
    }

    await updateAccount(user.id, {
      password: hashedResult.data,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    });

    return {
      status: "success",
      message: "Your password has been reset successfully.",
      data: null,
    };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }
    throw new AppError(authConstants.authMessage.serverError, 500);
  }
};
