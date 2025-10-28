import { forgotPasswordController } from "@src/modules/auth/controllers/forgot-password.controller";
import { loginController } from "@src/modules/auth/controllers/login.controller";
import { resendVerificationEmailController } from "@src/modules/auth/controllers/resend-verification-email.controller";
import { resetPasswordController } from "@src/modules/auth/controllers/reset-password.controller";
import { signupController } from "@src/modules/auth/controllers/signup.controller";
import { verifyController } from "@src/modules/auth/controllers/verify.controller";


export function AuthController() {

  return {

    signup: signupController,
    login: loginController,
    verify: verifyController,
    resendVerification: resendVerificationEmailController,
    resetPassword: resetPasswordController,
    forgotPassword: forgotPasswordController,



  };
}
