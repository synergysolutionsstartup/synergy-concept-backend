const userRole = {
  superAdmin: "super_admin",
  staff: "staff",
  student: "student",
  parent: "parent",
};


// TOKEN CONSTANTS
const jwtExpiry = { access: "7d", refresh: "14d", auth: "5m" };
const jwtKeys = {
  access: "access",
  refresh: "refresh",
  auth: "auth",
  resetPass: "reset-password",
};

export const constants = { userRole, jwtExpiry, jwtKeys };
