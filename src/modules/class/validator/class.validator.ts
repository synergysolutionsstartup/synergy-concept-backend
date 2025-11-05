// CLASS DTO SCHEMAS
import { common } from "@src/common/_index";

const validator = common.utils.validator;

const { Yup } = validator;

const readClassesSchema = Yup.object({
  schoolId: Yup.string().required("schoolId is required"),
});

const readClassInfoSchema = Yup.object({
  id: Yup.string().required("classId is required"),
});

const createClassDtoSchema = Yup.object({
    schoolId: Yup.string().required("schoolId is required"),
  name: Yup.string().required("name is required"),
  sections: Yup.array().required("At least one section must be selected"),
});

const updateClassSchema = Yup.object({
  id: Yup.string().required("school id is required"),
  name: Yup.string().optional(),

  sections: Yup.array()
    .optional()
    .min(1, "At least one section must be provided"),
});

export const dtoSchema = {
  create: createClassDtoSchema,
  update: updateClassSchema,
  readInfo: readClassInfoSchema,
  read: readClassesSchema,
};
