import { common } from "@src/common/_index";
import { authConstants } from "@src/modules/auth/constants";

export const autoSigninController = async () => {
  // INITILIZE COMMON PROPS
  const AppError = common.errors.AppError;
  const DatabaseError = common.errors.DatabaseError;

  const authMessage = authConstants.authMessage;

  try {
    // DTO Validations should have been done by the middlewares
    // THE AUTO SIGNIN RECEIVES THE EMAIL FROM THE CLIENT
    //  ===============================================================================
    // step 1
    // CHECK IF ACCOUNT WITH THAT EMAIL ALREADY EXIST
    // if no user not exist which means it is "forbidden"
    // then throw a (403 code,  userNotFound/session-expired message)
    // user must sign in again



    //  ===============================================================================
    // step 2
    // REFRESH TOKEN VALIDATION
    // IF user exist then check if
    // (a)  his refreshToken existin the db ha
    // (b)  his refreshToken in the db has expired or not
    /// IF any other above is true then throw a 403 "session-expired" error



    //  ===============================================================================
    // STEP 3
    // if refreshToken is still valid then
    // create a new acccessToken and send it back to the client
    // NOTE THE accessToken should only contain the "AccountResponseDto"
    //  return the accountResponseDto to the the client
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError(authMessage.serverError, 500);
  }
};
