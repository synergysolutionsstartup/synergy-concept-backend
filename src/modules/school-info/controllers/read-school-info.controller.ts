// OUTSIDE MODULE IMPORTS
import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";

// MODULE IMPORTS
import { services as authServices } from "@src/modules/auth/service/_index";
import { authConstants } from "@src/modules/auth/constants";
import { authUtils } from "@src/modules/auth/utils/_index";
import { AuthMapper } from "@src/modules/auth/mappers";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type CreateAccountDto = AccountTypes.Dtos.CreateAccountDto;

// CONTROLLER PROPS
interface Props {
  query: any;
  dao: any;
}

export const readSchoolInfoController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares
  try {
    const { dao, query } = props;
    const { userId, id } = props.query;
    if (!userId && !id) throw new AppError("Bad Request", 400);

    let result = null;

    if (id) {
     result = await dao.findById(id);
    } else if (userId) {
      result = await dao.findByUserId(userId);
    }
    const response = {
      status: "success",
      message: "School Information retrived successfully", // Replace with your actual message string
      data: result,
    };
    return response;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError("Internal Server Error", 500);
  }
};
