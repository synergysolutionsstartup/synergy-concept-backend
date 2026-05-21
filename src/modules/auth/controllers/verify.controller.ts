import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { constants } from "@src/common/constants";

// MODULE IMPORTS
import { authConstants } from "@src/modules/auth/constants";
import { AuthMapper } from "@src/modules/auth/mappers";

// INITIALIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type VerifyAcountDto = AccountTypes.Dtos.VerifyAcountDto;
type UpdateAccountRecord = AccountTypes.Records.UpdateAccountRecord;

// CONTROLLER PROPS
interface Props {
  body: VerifyAcountDto;
  dao: any;
}

export const verifyController = async (props: Props) => {
  try {
    const { body, dao } = props;
    const { findAccountByEmail, updateAccount } = dao;

    let user = await findAccountByEmail(body.email);
    if (!user) {
      throw new AppError(
        "Account not found. Please login again to your account",
        400
      );
    }

    if (user.verified) {
      const accountResponseDto = AuthMapper.mapAccountEntityToResponseDto(user);
      const tokens = generateAccessRefreshTokens(
        accountResponseDto,
        "Unable to verify your account due to a server error. Please try again later."
      );
      return {
        status: "success",
        message:
          "Account has already been verified. Please login to access your dashboard",
        data: { account: accountResponseDto, token: tokens.access },
      };
    }

    if (
      !user.verificationToken ||
      !user.verificationTokenExpiresAt ||
      new Date(user.verificationTokenExpiresAt) < new Date() ||
      body.token !== user.verificationToken
    ) {
      throw new AppError(
        "Invalid or expired verification code. Please request a new code.",
        400
      );
    }

    const accountResponseDto = AuthMapper.mapAccountEntityToResponseDto({
      ...user,
      verified: true,
    });
    const tokens = generateAccessRefreshTokens(
      accountResponseDto,
      "Unable to verify your account due to a server error. Please try again later."
    );

    const updatePayload: UpdateAccountRecord = {
      verified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
      refreshToken: tokens.refresh,
    };
    await updateAccount(user.id, updatePayload);

    return {
      status: "success",
      message: "Account has been verified. You can now access your dashboard",
      data: { account: accountResponseDto, token: tokens.access },
    };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError(authConstants.authMessage.serverError, 500);
  }
};

const generateAccessRefreshTokens = (user: any, errorMessage: string) => {
  const { signJwtToken } = common.utils.tokens;
  const { jwtKeys, jwtExpiry } = constants;

  const refreshToken = signJwtToken(
    user,
    jwtKeys.refresh,
    jwtKeys,
    jwtExpiry,
    true
  );
  const accessToken = signJwtToken(
    user,
    jwtKeys.access,
    jwtKeys,
    jwtExpiry,
    true
  );

  if (
    refreshToken.error ||
    !refreshToken.data ||
    accessToken.error ||
    !accessToken.data
  ) {
    console.error(
      "Verification token generation failed",
      refreshToken.error ?? accessToken.error
    );
    throw new AppError(errorMessage, 500);
  }

  return {
    access: accessToken.data,
    refresh: refreshToken.data,
  };
};
