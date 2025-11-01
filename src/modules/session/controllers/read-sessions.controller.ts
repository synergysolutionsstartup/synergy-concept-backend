// OUTSIDE MODULE IMPORTS
import { common } from "@src/common/_index";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;

// CONTROLLER PROPS
interface Props {
  schoolId: string;
  dao: any;
}

export const readSessionsController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares
  try {
    // CHECKS
    // CHECK IF THE SCHOOL EXIST WITH THE `schoolId` (TODO LATER)

    const { dao, schoolId } = props;

    const result = await dao.findAll(schoolId);
    const message = "Sessions record retrived successfully";
    const response = { status: "success", message, data: result };
    return response;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError("Internal Server Error", 500);
  }
};
