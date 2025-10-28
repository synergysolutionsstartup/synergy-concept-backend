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
    const { signJwtToken, verifyJwtToken } = common.utils.tokens;
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
      const updatePayload: UpdateAccountRecord = {
        refreshToken: refreshToken.data,
      };
      await dao.updateAccount(user.id, updatePayload);
      return {
        status: "success",
        message: authMessage.loginSuccess,
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

    // ========================================================================================================================
    // IF VERIFICATION TOKEN DOES NOT EXIST
    // check if the verificationToken does not exist for the user
    if (!user.verificationToken || user.verificationToken === "") {
      console.log("verificationToken dosen't exist.....getting new one");
      const userProfile = AuthMapper.getAccountProfile(user, userRole);
      await createSaveAndSendVerificationToken(
        email,
        userProfile.firstName,
        user.id,
        dao.updateAccount
      );
      return responseData;
    }

    // IF VERIFICATION TOKEN HAS EXPIRED
    // then send another one to the user else don't send another one
    const verificationTokenVerifyResult: Record<string, any> = verifyJwtToken(
      user.verificationToken,
      jwtKeys.auth,
      jwtKeys
    );

    if (verificationTokenVerifyResult.error) {
      const { error } = verificationTokenVerifyResult;
      // IF ERROR IS NOT AN EXPIRY ERROR....THEN THROW A LOGIN ERROR
      if (error?.name !== "TokenExpiredError") {
        throw new AppError(authMessage.serverError, 500);
      }

      // GENERATE, SAVE TO DB, AND SEND NEW TOKEN HERE
      console.log("current verification token expired.....getting new one");
      const userProfile = AuthMapper.getAccountProfile(user, userRole);
      await createSaveAndSendVerificationToken(
        email,
        userProfile.firstName,
        user.id,
        dao.updateAccount
      );
      return responseData;
    }

    console.log("current verification has not expired...user should check their email");
    // IF VERIFICTION TOKEN HAS NOT EXPIRED THEN USER SHOULD CHECK THEIR EMAIL FOR THE
    // TOKEN ALREADY SENT TO VERIFY THEIR EMAIL....NO NEED TO SEND A NEW ONE UNLESS THEY REQUEST FROM THE FRONT END
    return responseData;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError(authConstants.authMessage.serverError, 500);
  }
};
