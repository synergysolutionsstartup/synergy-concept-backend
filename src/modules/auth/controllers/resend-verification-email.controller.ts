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
  email: string;
  dao: any;
}

export const resendVerificationEmailController = async (props: Props) => {
  try {
    // BEFORE DOING ANY THING YOU CAN CHECK IF THE REQUEST HAS REACHED ITS LIMIT FOR THE DAY
    // TO REQUEST A NEW TOKEN TO SAVE RESOURCES(TO DO)

    const { dao, email } = props;
    const { signJwtToken, verifyJwtToken } = common.utils.tokens;
    const { jwtExpiry, jwtKeys } = common.constants;
    const { authMessage } = authConstants;
    const { findAccountByEmail } = props.dao;

    let user = await findAccountByEmail(email);
    if (!user) throw new AppError(authMessage.userNotFound, 400);
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

    const userRole = common.constants.userRole;
    const userProfile = AuthMapper.getAccountProfile(user, userRole);

    // CHECK IF A VERIFICATION TOKEN EXIST
    // IF IT DOES NOT THEN GENERATE ANOTHER ONE, SAVE TO DB, & SEND EMAIL,
    if (!user.verificationToken) {
          console.log("verificationToken does not exist....generating new one");
      await authServices.createSaveAndSendVerificationToken(
        email,
        userProfile.firstName,
        user.id,
        dao.updateAccount
      );

      const responseData = {
        status: "success",
        message: "Verification link has been re-sent to your email address.",
        data: null,
      };
      return responseData;
    }

    // IF IT DOES CHECK IF IT HAS PASSED A MINUTE
    // if false return a message to the user saying wait at least a minute
    const isTimePassed = authUtils.hasMinutesPassed(user.updatedAt, 1);
    if (!isTimePassed) {
        console.log("verificationToken exist but not up to a minute");
      const responseData = {
        status: "success",
        message:
          "Please wait at least one minute before requesting another email verification",
        data: null,
      };
      return responseData;
    }



    console.log("verificationToken exist but more than a minute");
  // if true then repeat the genreate process
    await authServices.createSaveAndSendVerificationToken(
      email,
      userProfile.firstName,
      user.id,
      dao.updateAccount
    );
    const responseData = {
      status: "success",
      message: "Verification link has been re-sent to your email address.",
      data: null,
    };
    return responseData;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }
    throw new AppError(authConstants.authMessage.serverError, 500);
  }
};
