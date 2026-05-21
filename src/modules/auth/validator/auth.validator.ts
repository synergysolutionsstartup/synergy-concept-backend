import { common } from "@src/common/_index";

const validator = common.utils.validator;

const { Yup } = validator;

const signupDtoSchema = Yup.object({
  firstName: Yup.string().required("first name is required"),
  lastName: Yup.string().required("last name is required"),
  email: Yup.string().email().required("email is required"),
  password: Yup.string().required("password is required"),
});


const loginDtoSchema = Yup.object({
  email: Yup.string().email().required("email is required"),
  password: Yup.string().required("password is required"),
});

const verifyDtoSchema = Yup.object({
  email: Yup.string().email().required("email is required"),
  token: Yup.string().required("token is required"),
});

const approveAdminDtoSchema = Yup.object({
  id: Yup.string().required("admin id is required"),
});

const createSuperAdminDtoSchema = Yup.object({
  firstName: Yup.string().required("first name is required"),
  lastName: Yup.string().required("last name is required"),
  email: Yup.string().email().required("email is required"),
  password: Yup.string().required("password is required"),
});

const approveManyAdminsDtoSchema = Yup.object({
  ids: Yup.array()
    .of(Yup.string().required("admin id is required"))
    .min(1, "ids is required"),
});

const readUsersDtoSchema = Yup.object({
  role: Yup.string()
    .oneOf(
      Object.values(common.constants.userRole) as string[],
      `role must be one of [${Object.values(common.constants.userRole).join(", ")}]`
    )
    .notRequired(),
});

const resendVerifyDtoSchema = Yup.object({
  email: Yup.string().required("email address is required"),
});

export const dtoSchema = {
  signup: signupDtoSchema,
  createSuperAdmin: createSuperAdminDtoSchema,
  approveAdmin: approveAdminDtoSchema,
  approveManyAdmins: approveManyAdminsDtoSchema,
  login: loginDtoSchema,
  verify: verifyDtoSchema,
  readUsers: readUsersDtoSchema,
  resendVerify: resendVerifyDtoSchema,
};
