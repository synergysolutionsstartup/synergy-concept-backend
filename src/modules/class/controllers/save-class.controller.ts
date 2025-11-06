// OUTSIDE MODULE IMPORTS
import { ClassTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type CreateClassDto = ClassTypes.Dtos.CreateClassDto;

type NewClassRecord = ClassTypes.Records.NewClassRecord;

// CONTROLLER PROPS

interface Props {
  body: CreateClassDto;
  dao: any;
}

export const saveClassController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares

  try {
    const { dao, body } = props;
    let result = null;

    let message = "";
    // console.log("props-controller ", props)

    // CHECKS
    // check 1 if the schoolId exists (implemented)
    // check 2 if the user creating the Class belongs to the school (TODO later)
    // check 3 if the user creatinf the class is an actual user in the db and an admin (extra security)  (TODO later)
    // CHECK 4 IF A RECORD ALOREADY EXIST IN THE DB WITH THE same dto fields: schoolId, name, section  (TODO later)

    // check 1
    const schoolInfo = await dao.findSchool(body.schoolId);
    message = "Bad Request. School Id does not exist";
    if (!schoolInfo) throw new AppError(message, 400);

    // check 4
    // check if the class with the same name and schoolId already exist
    const filterPayload = { schoolId: body.schoolId, name: body.name };
    const existingClass = await dao.findOne(filterPayload);
    if (existingClass) {
      message = "Class with the name already exist. Please use another name";
      throw new AppError(message, 400);
    }

    const recordPayload: NewClassRecord = { ...body };
    result = await dao.create(recordPayload);
    message = "Class was created successfully";

    const response = { status: "success", message, data: result };
    return response;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }
    throw new AppError("Internal Server Error", 500);
  }
};
