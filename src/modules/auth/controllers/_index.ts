import { forgotPasswordController } from "@src/modules/auth/controllers/forgot-password.controller";
import { loginController } from "@src/modules/auth/controllers/login.controller";
import { resendVerificationEmailController } from "@src/modules/auth/controllers/resend-verification-email.controller";
import { resetPasswordController } from "@src/modules/auth/controllers/reset-password.controller";
import { signupController } from "@src/modules/auth/controllers/signup.controller";
import { verifyController } from "@src/modules/auth/controllers/verify.controller";
import { approveAdminController } from "@src/modules/auth/controllers/approve-admin.controller";
import { readAdminsController } from "@src/modules/auth/controllers/read-admins.controller";
import { readUsersController } from "@src/modules/auth/controllers/read-users.controller";
import { approveManyAdminsController } from "@src/modules/auth/controllers/approve-many-admins.controller";
import { createSuperAdminController } from "@src/modules/auth/controllers/create-superadmin.controller";


export function AuthController() {

  return {

    signup: signupController,
    login: loginController,
    verify: verifyController,
    resendVerification: resendVerificationEmailController,
    resetPassword: resetPasswordController,
    forgotPassword: forgotPasswordController,
    approveAdmin: approveAdminController,
    readAdmins: readAdminsController,
    readUsers: readUsersController,
    approveManyAdmins: approveManyAdminsController,
    createSuperAdmin: createSuperAdminController,


  };
}
