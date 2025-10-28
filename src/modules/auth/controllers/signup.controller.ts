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
type CreateAccountDto = AccountTypes.Dtos.CreateAccountDto;
type AuthDaoType = AccountTypes.Dao.AuthDaoType;

// CONTROLLER PROPS
interface Props {
  body: CreateAccountDto;
  dao: any;
}

export const signupController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares

  const { jwtNames, jwtExpiry } = authConstants;
  const { authMessage } = authConstants;

  try {
    const tokenUtils = common.utils.tokens;
    const hashUtils = common.utils.hash;
    const constants = common.constants;
    const services = common.services;

    const { dao, body } = props;

    const { email, password, firstName, lastName } = body;

    // CHECK IF ACCOUNT WITH THAT EMAIL ALREADY EXIST
    // if yes then return error with appripriate message

    const user = await dao.findAccountByEmail(body.email);
    // console.log("Existing user ", user);
    if (user) throw new AppError(authMessage.userExists, 400);

    // HASH THE USER PASSWORD
    const hashedResult = await hashUtils.hashPassword(password);
    if (hashedResult.error) throw new AppError(authMessage.serverError, 500);
    const hashedPassword: string | undefined = hashedResult.data;
    // console.log("hashedResult", hashedResult);
    
    // GENERATE VERIFICATION TOKEN (ALSO KNOWN AS AUTH TOKEN)
    // use the users email as the payload of the token
    const verifyTokenPayload = { email: body.email };
    const verifyTokenResult = tokenUtils.signJwtToken(
      verifyTokenPayload,
      jwtNames.auth,
      jwtNames,
      jwtExpiry,
      true
    );
    if (verifyTokenResult.error || !verifyTokenResult.data) {
      // console.log("verifyToken Error ", verifyTokenResult.error);
      throw new AppError(authMessage.serverError, 400);
    }
    const verifyToken = verifyTokenResult.data;
    // console.log("verifyToken", verifyTokenResult);

    // save user with token: if error then retun
    const userRecord = {
      email,
      role: constants.userRole.superAdmin,
      password: hashedPassword,
      verificationToken: verifyTokenResult.data,
      superAdminProfile: {
        firstName,
        lastName,
      },
    };

    const account = await dao.createAccount(userRecord);
    console.log("created user", account);

    const accountResponseDto = AuthMapper.mapAccountEntityToResponseDto(account);
    console.log("mapping result ", accountResponseDto);


    // SEND THE VERIFICATION EMAIL
    const verifyEmailPayload = {
      constants: authConstants,
      token: verifyToken,
      userFirstName: firstName,
      userEmail: email,
      getEmailTemplate: authUtils.getEmailTemplate,
      sendEmail: services.email.sendSingleRecipient,
    };

    const sendVerifyMailResult = await authServices.sendVerificationEmail(
      verifyEmailPayload
    );

    if (sendVerifyMailResult.error) {
       console.log("sendVerifyMail error ", sendVerifyMailResult.error);
      throw new AppError("Error sending verification email", 500);
    }

    // return ResponseDTO object back to the route
    const response = {
      status: "success",
      message: authMessage.signupSuccess, // Replace with your actual message string
      data: accountResponseDto,
    };

    return response;
  } catch (error) {

    console.log("controller error ", error)
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError(authMessage.serverError, 500);
  }
};
