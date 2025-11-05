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

export const readClassInfoController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares
  
  try {
    const { dao, id } = props;

        // CHECKS
    // Check if the user reading the class info belongs to the school(TODO LATER)

    const result = await dao.findById(id);
    const message = "Class data retrived successfully";
    const response = { status: "success", message, data: result };
    return response;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError("Internal Server Error", 500);
  }
};
