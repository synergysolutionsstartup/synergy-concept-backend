// OUTSIDE MODULE IMPORTS
import { common } from "@src/common/_index";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;

// CONTROLLER PROPS
interface Props {
  id: string;
  dao: any;
}

export const deleteClassController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares
  try {
    const { dao, id } = props;

    // CHECKS
    // CHECK 1 IF THE SCHOOL EXIST WITH THE `schoolId` (TODO LATER)
    // check 2 if the user deleting the Class belongs to the school (TODO later)
    // check 3 if the user deleting the class is an actual user in the db and an admin (extra security)  (TODO later)

    const result = await dao.remove(id);
    const message = "Class deleted successfully";
    const response = { status: "success", message, data: result };

    return response;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError("Internal Server Error", 500);
  }
};
