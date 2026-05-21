// OUTSIDE MODULE IMPORTS
import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";

// MODULE IMPORTS
import { services as authServices } from "@src/modules/auth/service/_index";
import { authConstants } from "@src/modules/auth/constants";
import { authUtils } from "@src/modules/auth/utils/_index";
import { AuthMapper } from "@src/modules/auth/mappers";
import { SchoolInfoDao } from "@src/modules/school-info/dao/_index";
import { db } from "@src/database/_index/index";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type SignupDto = AccountTypes.Dtos.SignupDto;

type AuthDaoType = AccountTypes.Dao.AuthDaoType;

// CONTROLLER PROPS
interface Props {
  body: SignupDto;
  dao: any;
}

export const signupController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares
  const { authMessage } = authConstants;

  try {
    const hashUtils = common.utils.hash;
    const { services } = common;
    const { dao, body } = props;
    const { email, password, firstName, lastName } = body;

    const schoolInfoDao = SchoolInfoDao(db.dbClient, db.parseDbError);
    const schoolInfo = await schoolInfoDao.findFirst();
    if (!schoolInfo) {
      throw new AppError(
        "School information must be created before admin signup. Please contact support.",
        400
      );
    }

    const user = await dao.findAccountByEmail(email);
    if (user) throw new AppError(authMessage.userExists, 400);

    const hashedResult = await hashUtils.hashPassword(password);
    if (hashedResult.error || !hashedResult.data) {
      console.error("Password hashing failed", hashedResult.error);
      throw new AppError(authMessage.serverError, 500);
    }

    const verificationCode = authUtils.generateOTP();
    if (!verificationCode) {
      console.error("Signup verification code generation failed");
      throw new AppError(authMessage.serverError, 500);
    }

    const adminProfilePayload = {
      firstName,
      lastName,
    };

    const userRecord: Record<string, any> = {
      email,
      role: common.constants.userRole.admin,
      password: hashedResult.data,
      verificationToken: verificationCode,
      verificationTokenExpiresAt: new Date(
        Date.now() + authConstants.otpExpiry.verification
      ),
      adminProfile: adminProfilePayload,
      schoolId: schoolInfo.id,
      isApproved: false,
    };

    const account = await dao.createAccount(userRecord);
    const accountResponseDto = AuthMapper.mapAccountEntityToResponseDto(account);

    const verifyEmailPayload = {
      token: verificationCode,
      userEmail: email,
      getEmailTemplate: authUtils.buildVerificationEmail,
      sendEmail: services.email.sendSingleRecipient,
      senderName: authConstants.mailProps.appName ?? "BizFlow",
      senderEmail: authConstants.mailProps.appEmail ?? "no-reply@bizflow.com",
    };

    const sendVerifyMailResult = await authServices.sendVerificationEmail(
      verifyEmailPayload
    );

    if (sendVerifyMailResult.error) {
      console.error("sendVerifyMail error", sendVerifyMailResult.error);
      throw new AppError(authMessage.serverError, 500);
    }

    return {
      status: "success",
      message: authMessage.signupSuccess,
      data: { account: accountResponseDto },
    };
  } catch (error) {
    console.log("controller error", error);
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }
    throw new AppError(authMessage.serverError, 500);
  }
};
