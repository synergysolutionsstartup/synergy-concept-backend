import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { constants } from "@src/common/constants";

// MODULE IMPORTS
import { authConstants } from "@src/modules/auth/constants";
import { AuthMapper } from "@src/modules/auth/mappers";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type VerifyAcountDto = AccountTypes.Dtos.VerifyAcountDto;
type AuthDaoType = AccountTypes.Dao.AuthDaoType;
type UpdateAccountRecord = AccountTypes.Records.UpdateAccountRecord;

// CONTROLLER PROPS
interface Props {
  body: VerifyAcountDto;
  dao: any;
}

export const verifyController = async (props: Props) => {
  try {
    const { verifyJwtToken, signJwtToken } = common.utils.tokens;
    const { body, dao } = props;
    const { findAccountByEmail, updateAccount } = dao;
    
    // Validate the token and decode the token from the client
    const verifyResult = verifyJwtToken(
      body.token,
      constants.jwtKeys.auth,
      constants.jwtKeys
    );
    if (verifyResult.error) {
      const error: Record<string, any> = verifyResult.error;
      if (error?.name === "TokenExpiredError") {
        throw new AppError(
          "Expired verification link. Please log-in to your account again",
          400
        );
      }
      throw new AppError("Invalid verification link", 400);
    }

    // GET the decodedTokenData data from the token
    // Then find the user account associated with the email of the decodedTokenData data from the database
    const decodedTokenData = verifyResult.data;
    let user = await findAccountByEmail(decodedTokenData.email);
    if (!user) {
      throw new AppError(
        "Account not Found. Please login again to your account",
        400
      );
    }

    // NEXT CHECK IF THE ACCOUNT IS VERIFIED OR NOT
    // IF VERIFIED Generate tokens and RETURN MESSAGE SAYING ACCOUTNIS VERIFIED
    if (user.verified) {
      const accountResponseDto = AuthMapper.mapAccountEntityToResponseDto(user);
      const tokens = generateAccessRefreshTokens(accountResponseDto);
      return {
        status: "success",
        message:
          "Account has already been verified. Please login to access your dashboard",
        data: { account: accountResponseDto, token: tokens.access },
      };
    }

    // This part means the token is deocded successfully but the user staus is still not verified in the database
    // check if the token from the client match the token in the database. If they
    // If they dont then the decodedTokenData token (from the client) is not the current one in the database which makes it invalid
    if (body.token !== user.verificationToken) {
      throw new AppError(
        "Invalid verification link. Please use the most recent verification link sent to your mail",
        400
      );
    }

    // If the tokens match then it means ALL VALIDATION CHECKS OUT
    // then generate access and refresh token
    // then update the refreshToken and verified status in the database;

    // verified needs to be true here cos the accountResponseDto
    // needs to reflect that the user verified status has actually been
    // updated before encoding it into a token
    let accountResponseDto = AuthMapper.mapAccountEntityToResponseDto({
      ...user,
      verified: true,
    });
    const tokens = generateAccessRefreshTokens(accountResponseDto);
    const updatePayload: UpdateAccountRecord = {
      verified: true,
      verificationToken: null,
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

const generateAccessRefreshTokens = (user: any) => {
  const { signJwtToken } = common.utils.tokens;
  const { jwtKeys, jwtExpiry } = constants;

  // the user params here is a AccountResponseDto
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

  return {
    access: accessToken.data,
    refresh: refreshToken.data,
  };
};
