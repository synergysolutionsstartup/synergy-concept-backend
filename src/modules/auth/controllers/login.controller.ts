// OUTSIDE MODULE IMPORTS
import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";

// MODULE IMPORTS
import { services as authServices } from "@src/modules/auth/service/_index";
import { authConstants } from "@src/modules/auth/constants";
import { authUtils } from "@src/modules/auth/utils/_index";
import { AuthMapper } from "@src/modules/auth/mappers";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type LoginDto = AccountTypes.Dtos.LoginDto;
type AuthDaoType = AccountTypes.Dao.AuthDaoType;
type UpdateAccountRecord = AccountTypes.Records.UpdateAccountRecord;

// CONTROLLER PROPS
interface Props {
  body: LoginDto;
  dao: any;
}

export const loginController = async (props: Props) => {
  try {
    const { dao, body } = props;

    const { verifyPassword } = common.utils.hash;
    const { signJwtToken } = common.utils.tokens;
    const { jwtExpiry, jwtKeys, userRole } = common.constants;
    const { authMessage } = authConstants;
    const { findAccountByEmail } = props.dao;
    const { email, password } = props.body;

    let user = await findAccountByEmail(email);
    if (!user) throw new AppError(authMessage.userNotFound, 400);

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new AppError(authMessage.invalidCredentials, 400);
    }

    if (user.verified) {
      // if user is verified.....
      // then generate access and refresh token again
      // update the new access refresh token in the db

      const accountResponse = AuthMapper.mapAccountEntityToResponseDto(user);
      const refreshToken = signJwtToken(
        accountResponse,
        jwtKeys.refresh,
        jwtKeys,
        jwtExpiry,
        true
      );
      const accessToken = signJwtToken(
        accountResponse,
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
          "Login token generation failed",
          refreshToken.error ?? accessToken.error
        );
        throw new AppError(
          "Unable to login due to a server error. Please try again later.",
          500
        );
      }
      const updatePayload: UpdateAccountRecord = {
        refreshToken: refreshToken.data,
      };
      await dao.updateAccount(user.id, updatePayload);

      const loginMessage =
        user.role === common.constants.userRole.admin && !user.isApproved
          ? authMessage.loginPendingApproval
          : authMessage.loginSuccess;

      return {
        status: "success",
        message: loginMessage,
        data: { account: accountResponse, token: accessToken.data },
      };
    }

    // ========================================================================================================================
    // THIS PART OF THE CODE MEANS : USER IS NOT VERIFIED YET
    // ========================================================================================================================

    const responseData = {
      status: "success",
      message: authMessage.loginNotVerified,
      data: null,
    };
    const createSaveAndSendVerificationToken =
      authServices.createSaveAndSendVerificationToken;

    if (!user.verificationToken || user.verificationToken === "") {
      console.log("verification code doesn't exist.....getting new one");
      const userProfile = AuthMapper.getAccountProfile(user, userRole);
      await createSaveAndSendVerificationToken(
        email,
        userProfile.firstName,
        user.id,
        dao.updateAccount
      );
      return responseData;
    }

    const isExpired =
      !user.verificationTokenExpiresAt ||
      new Date(user.verificationTokenExpiresAt) < new Date();
    if (isExpired) {
      console.log("current verification code expired.....getting new one");
      const userProfile = AuthMapper.getAccountProfile(user, userRole);
      await createSaveAndSendVerificationToken(
        email,
        userProfile.firstName,
        user.id,
        dao.updateAccount
      );
      return responseData;
    }

    console.log(
      "current verification code is still valid...user should check their email"
    );
    return responseData;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError(authConstants.authMessage.serverError, 500);
  }
};
