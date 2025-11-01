// OUTSIDE MODULE IMPORTS
import { SchoolInfoTypes } from "@src/_types/_index";
import {
  NewSchoolInfoRecord,
  UpdateSchoolInfoRecord,
} from "@src/_types/school-info/records.type";
import { common } from "@src/common/_index";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type CreateSchoolInfoDto = SchoolInfoTypes.Dtos.CreateSchoolInfoDTO;
type UpdateSchoolInfoDto = SchoolInfoTypes.Dtos.UpdateSchoolInfoDTO;

// CONTROLLER PROPS

interface Props {
  body: CreateSchoolInfoDto | UpdateSchoolInfoDto;
  requestId: string;
  appDao: any;
  dao: any;
  route: string;
}

export const saveSchoolInfoController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares

  try {
    const { dao, body, route, requestId, appDao } = props;
    let result = null;

    const constants = common.constants;

    // check if the requqestId belongs to to a super admin account
    // if not then throw error Not Authorized
    const user = await appDao.account.findAccountById(requestId);
    if (!user || user.role !== constants.userRole.superAdmin) {
      throw new AppError("Not Authrized. Invalid credentials", 401);
    }

    if (route === "create") {
      const recordPayload: UpdateSchoolInfoRecord | NewSchoolInfoRecord = {
        ...(body as CreateSchoolInfoDto),
        userId: requestId,
      };
      result = await dao.createSchoolInfo(requestId, recordPayload);
    } else if (route === "update") {
      const recordPayload: UpdateSchoolInfoRecord = {
        ...(body as UpdateSchoolInfoRecord),
        userId: requestId,
      };

      result = await dao.updateSchoolInfo(recordPayload);
    }
    const response = {
      status: "success",
      message: "School information saved successfully", // Replace with your actual message string
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
