export const mailProps = {
  appName: "School Management System",
  appEmail: "temidaramola7@gmai@gmail.com",
};

const authMessage = {
  userExists: "An account already exist with this email. Please try again",
  serverError: "There was an error with your request. Please try again",
  userNotFound: "Account not found. Please try again",
  invalidCredentials: "Invalid email or password. Please try again",
  loginSuccess: "Login successful. You can now access your dashboard",
  loginNotVerified:
    "Login successful. Please verify your email to access your dashboard",
  signupSuccess:
    "Account has been created. Please verify your email to access your account",
};

// EMAIL CONTENT CONSTANTS
const verifyAccountMailContent = {
  receiverName: "",
  header: "Account Verification",
  title: "Verify Your Account Email",
  message:
    "Thank you for creating your account! Please click on the button below to verify your email address.",
  url: "http://127.0.0.1:5173/auth/verify-email/",
    buttonText: "Confirm Email",

};

const resetPasswordMail = {
  header: "Password Reset Request",
  title: "Reset Your Password.",
  message:
    "We've received a request to reset your password. For security, we're sending this email to verify your identity and help you reset your password. To reset your password, please click the button below:",
  btnText: "Reset Password",
  url: "http://127.0.0.1:5173/auth/password/verify/",
};

const verifyResetEmailMail = {
  header: "Email Address Verification",
  title: "Verify Your Account's New Email Address",
  message:
    "We received a request to change the email address associated with your account. If you did not request this change, please ignore this email.  Please confirm your new email address by clicking the link below",
  btnText: "Confirm Email",
  url: "http://127.0.0.1:5173/auth/verify-email/",
};

// TOKEN CONSTANTS
const jwtExpiry = { access: "7d", refresh: "14d", auth: "5m" };
const jwtNames = {
  access: "access",
  refresh: "refresh",
  auth: "auth",
  resetPass: "reset-password",
};

export const authConstants = {
  authMessage,
  jwtExpiry,
  jwtNames,
  verifyAccountMailContent,
  verifyResetEmailMail,
  resetPasswordMail,
  mailProps
};
