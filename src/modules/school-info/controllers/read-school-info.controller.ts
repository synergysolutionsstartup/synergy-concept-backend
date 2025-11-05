// OUTSIDE MODULE IMPORTS
import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;

// CONTROLLER PROPS
interface Props {
  query: any;
  dao: any;
}

export const readSchoolInfoController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares
  try {
    const { dao, query } = props;
    const { id } = props.query;
    if (!id) throw new AppError("Bad Request", 400);

    const nullKey = "N/A";
    const result = await dao.findById(id);

    if (!result) {
      const response: Record<string, any> = {
        status: "success",
        message: "School Information retrived successfully", // Replace with your actual message string
        data: result,
      };

      return response;
    }

    // check if the data from the database is the null data or actuall data
    // if it is the defaut data then replace the fields whose value is "N/A" to null

    const mappedData: any = {};
    Object.keys(result).map((item: string) => {
      mappedData[item] = result[item];
      if (result[item] === nullKey) {
        mappedData[item] = null;
      }
    });


    const {userId, ...rest} = mappedData

    const response = {
      status: "success",
      message: "School Information retrived successfully", // Replace with your actual message string
      data: rest,
    };
    return response;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError("Internal Server Error", 500);
  }
};
