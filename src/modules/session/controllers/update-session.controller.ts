// OUTSIDE MODULE IMPORTS
import { AccountTypes, SessionTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { SessionUtils } from "@src/modules/session/utils/_index";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type UpdateSessionoDto = SessionTypes.Dtos.UpdateSessionDTO;
type UpdateSessionRecord = SessionTypes.Records.UpdateSessionRecord;

// CONTROLLER PROPS

interface Props {
  body: UpdateSessionoDto;
  dao: any;
  requestUser: AccountTypes.Dtos.AccountResponseDTO;
}

export const updateSessionController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares
  // console.log("reached the save controller")

  try {
    const { dao, body, requestUser } = props;
    let message = "";
    let parsedDates: Record<string, any> = {};

    const { validateDate } = SessionUtils(common.utils.date);

    // CHECKS
    // check if the user is an actual admin or super-admin (extra security)  (TODO later)
    // check if the person creating/updating the session belongs to the school  (TODO later)

    // check if sesision exist or not
    const session = await dao.findById(body.id);
    message = "Session you want to update does not exist";
    if (!session) throw new AppError(message, 400);

    // validate the session dates
    if (body.startDate) {
      const dates = validateDate(body.startDate);
      message = dates.error as any as string;
      if (!dates.isValid) throw new AppError(message, 400);
      parsedDates["startDate"] = dates.date;
    }

    if (body.endDate) {
      const dates = validateDate(body.endDate);
      message = dates.error as any as string;
      if (!dates.isValid) throw new AppError(message, 400);
      parsedDates["endDate"] = dates.date;
    }

    const { startDate, endDate, ...rest } = body;
    const recordPayload: UpdateSessionRecord = { ...rest, ...parsedDates };

    const result = await dao.update(recordPayload);
    message = "Session information updated successfully";

    const response = { status: "success", message, data: result };
    return response;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }

    throw new AppError("Internal Server Error", 500);
  }
};
