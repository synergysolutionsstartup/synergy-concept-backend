const userRole = {
  superAdmin: "super_admin",
  admin: "admin",
  staff: "staff",
  student: "student",
  parent: "parent",
};


// TOKEN CONSTANTS
const jwtExpiry = {
  access: process.env.JWT_ACCESS_EXPIRES_IN || "7d",
  refresh: process.env.JWT_REFRESH_EXPIRES_IN || "14d",
  auth: process.env.VERIFICATION_TOKEN_EXPIRES_IN || "30m",
  resetPass: process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN || "30m",
};
const jwtKeys = {
  access: "access",
  refresh: "refresh",
  auth: "auth",
  resetPass: "reset-password",
};

export const constants = { userRole, jwtExpiry, jwtKeys };
