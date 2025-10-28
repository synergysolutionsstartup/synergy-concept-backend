// OUTSIDE MODULE IMPORTS
import { SchoolInfoTypes } from "@src/_types/_index";
import {
  NewSchoolInfoRecord,
  UpdateSchoolInfoRecord,
} from "@src/_types/school-info/records.type";
import { common } from "@src/common/_index";

// MODULE IMPORTS
import { authConstants } from "@src/modules/auth/constants";

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

  // console.log("reached the save controller")

  try {
    const { dao, body, route, requestId, appDao } = props;
    let result = null;

    // console.log("props-controller ", props)

    // check if the requqestId belongs to to a super admin account
    // if not then throw error Not Authorized
    const user = await appDao.account.findAccountById(requestId);
    if (!user) throw new AppError("Not Authrized. Invalid credentials", 401);
    // console.log("userCheckResult ", user);

    if (route === "create") {
      // console.log("calling the create dao")

      const recordPayload: UpdateSchoolInfoRecord | NewSchoolInfoRecord = {
        ...(body as CreateSchoolInfoDto),
        userId: requestId,
      };
      result = await dao.createSchoolInfo(requestId, recordPayload);
    } else if (route === "update") {
      // console.log("calling the update dao ")
 
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
