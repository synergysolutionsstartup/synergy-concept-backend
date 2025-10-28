import { common } from "@src/common/_index";
import { authConstants } from "@src/modules/auth/constants";

export const refreshAccessTokenController = async () => {
  // INITILIZE COMMON PROPS
  const AppError = common.errors.AppError;
  const DatabaseError = common.errors.DatabaseError;

  const authMessage = authConstants.authMessage;

  try {
   
    // DTO Validations should have been done by the middlewares
    // THE REFRESH ACCESS_TOKEN RECEIVES THE EMAIL OF THE USER

    //  ===============================================================================
    // step 1
    // CHECK IF ACCOUNT WITH THAT EMAIL ALREADY EXIST
    // if no user not exist with the email then it means it is "forbidden"
    // then throw a (403 code,  userNotFound message)
    // user must sign in again
   

    //  ===============================================================================
    // step 2
    // REFRESH TOKEN VALIDATION
    // IF user exist then check if
    // (a)  his refreshToken existin the db
    // (b)  his refreshToken in the db has expired or not
    /// IF any other above is true then throw a (403 code,  sessionExpired message) error
   
   
    //  ===============================================================================
    // STEP 3
    // if refreshToken is still valid then
    // create a new acccessToken and send it back to the client
    // NOTE THE accessToken should only contain the "AccountResponseDto"
    // (no need to send the accountResponseDto back to the client..just the token)
    //
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError(authMessage.serverError, 500);
  }
};
