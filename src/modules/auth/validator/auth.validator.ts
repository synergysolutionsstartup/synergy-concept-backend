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
  token: Yup.string().required("token is required"),
});

const resendVerifyDtoSchema = Yup.object({
  email: Yup.string().required("email address is required"),
});

export const dtoSchema = {
  signup: signupDtoSchema,
  login: loginDtoSchema,
  verify: verifyDtoSchema,
  resendVerify: resendVerifyDtoSchema
};
