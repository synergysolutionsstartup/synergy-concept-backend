import dotenv from "dotenv";
dotenv.config();


export const mailProps = {
  appName: process.env.APP_NAME,
  appEmail: process.env.APP_EMAIL,
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
  url: process.env.CLIENT_VERIFY_EMAIL_REDIRECT_URL,
    buttonText: "Confirm Email",

};

const resetPasswordMailContent = {
  header: "Password Reset Request",
  title: "Reset Your Password.",
  message:
    "We've received a request to reset your password. For security, we're sending this email to verify your identity and help you reset your password. To reset your password, please click the button below:",
  btnText: "Reset Password",
  url: process.env.CLIENT_RESET_PASSWORD_REDIRECT_URL,
};

const resetEmailAddressMailContent = {
  header: "Email Address Verification",
  title: "Verify Your Account's New Email Address",
  message:
    "We received a request to change the email address associated with your account. If you did not request this change, please ignore this email.  Please confirm your new email address by clicking the link below",
  btnText: "Confirm Email",
  url: process.env.CLIENT_RESET_EMAIL_REDIRECT_URL,
};

// TOKEN CONSTANTS
const jwtExpiry = { access: "7d", refresh: "14d", auth: "30m" };
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
  resetEmailAddressMailContent,
  resetPasswordMailContent,
  mailProps
};
