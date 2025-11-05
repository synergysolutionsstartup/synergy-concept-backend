import { common } from "@src/common/_index";

const validator = common.utils.validator;

const { Yup } = validator;


const readSchoolInfoDtoSchema = Yup.object({
  id: Yup.string().required("school id is required"),
});

const createSchoolDtoSchema = Yup.object({
  name: Yup.string().required("name is required"),
  photo: Yup.string().optional(),
  email: Yup.string().email().required("email is required"),
  phoneNumber1: Yup.string().required("Phone 1 number is required"),
  phoneNumber2: Yup.string().optional(),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  address: Yup.string().required("address is required"),
});

const updateSchoolDtoSchema = Yup.object({
  id: Yup.string().required("school id is required"),
  name: Yup.string().optional(),
  photo: Yup.string().optional(),
  email: Yup.string().email().optional(),
  phoneNumber1: Yup.string().optional(),
  phoneNumber2: Yup.string().optional(),
  state: Yup.string().optional(),
  country: Yup.string().optional(),
  address: Yup.string().optional(),
});



export const dtoSchema = {
  createSchool: createSchoolDtoSchema,
  updateSchool: updateSchoolDtoSchema,
  readSchoolInfo: readSchoolInfoDtoSchema,
};
