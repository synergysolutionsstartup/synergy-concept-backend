import { common } from "@src/common/_index";

const validator = common.utils.validator;

const { Yup } = validator;

const readSessionsSchema = Yup.object({
  schoolId: Yup.string().required("schoolId is required"),
});
const readSessionInfoSchema = Yup.object({
  id: Yup.string().required("sessionId is required"),
});

const createSessionDtoSchema = Yup.object({
  year: Yup.string().required("year is required"),
  term: Yup.string().required("term is required"),
  isActive: Yup.boolean().required("isActive is required"),
  startDate: Yup.string().required("start date is required"),
  endDate: Yup.string().required("end date is required"),
});

const updateSessionSchema = Yup.object({
  id: Yup.string().required("school id is required"),
  year: Yup.string().optional(),
  term: Yup.string().optional(),
  isActive: Yup.boolean().optional(),
   startDate: Yup.string().optional(),
  endDate: Yup.string().optional(),
});

export const dtoSchema = {
  create: createSessionDtoSchema,
  update: updateSessionSchema,
  readInfo: readSessionInfoSchema,
  read: readSessionsSchema,
};
