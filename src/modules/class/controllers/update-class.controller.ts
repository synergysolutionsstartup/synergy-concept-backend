// OUTSIDE MODULE IMPORTS
import { ClassTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type UpdateClassoDto = ClassTypes.Dtos.UpdateClassDTO;
type UpdateClassRecord = ClassTypes.Records.UpdateClassRecord;

// CONTROLLER PROPS

interface Props {
  body: UpdateClassoDto;
  dao: any;
}

export const updateClassController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares

  try {
    const { dao, body } = props;
    let result = null;

    // console.log("props-controller ", props)

    // CHECKS
    // check 2 if the user updating the Class belongs to the school (extra security) (TODO later)
    // check 3 if the user updating the Class is an actual user in the db and is an admin (extra security)  (TODO later)
    // check 4 if class you want to update is real or not

    // check 4
    const classResult = await dao.findById(body.id);
    let message = "The class you you want to update does not exist or has been removed.";
    if (!classResult) throw new AppError(message, 400);

    const recordPayload: UpdateClassRecord = { ...body };
    result = await dao.update(recordPayload);
    message = "Class information updated successfully";

    const response = { status: "success", message, data: result };
    return response;
  } catch (error) {
    // console.log("controller Error ", error)
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError("Internal Server Error", 500);
  }
};
