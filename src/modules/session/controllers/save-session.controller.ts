// OUTSIDE MODULE IMPORTS
import { SessionTypes, AccountTypes } from "@src/_types/_index";
import { AccountEntity } from "@src/_types/account/entities.type";
import { common } from "@src/common/_index";
import { SessionUtils } from "@src/modules/session/utils/_index";

// INITILIZE COMMON PROPS
const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;
type CreateSessionDto = SessionTypes.Dtos.CreateSessionDto;
type NewSessionRecord = SessionTypes.Records.NewSessionRecord;

// CONTROLLER PROPS
interface Props {
  body: CreateSessionDto;
  dao: any;
  requestUser: AccountTypes.Dtos.AccountResponseDTO;
}

export const saveSessionController = async (props: Props) => {
  // NOTE: DTO Validations should have been done by the middlewares

  try {
    const { dao, body, requestUser } = props;
    let message = "";
    const { validateSessionDates } = SessionUtils(common.utils.date);

    // EXTRA SECURITY CHECKS
    // check if the person creating the session belongs to the school (TODO later)
    // check if the user is an actual user and an admin (extra security)  (TODO later)

    // validate the session dates
    const dates = validateSessionDates(body.startDate, body.endDate);
    if (!dates.isValid) throw new AppError(dates.error, 400);
    const { startDate, endDate } = dates;

    const schoolId = requestUser.schoolId;

    // check if the session with the same year, term and schoolId already exist
    const existingSession = await dao.findOne({
      schoolId,
      term: body.term,
      year: body.year,
    });

    if (existingSession) {
      message = "Session already exists for this school/term/year";
      throw new AppError(message, 400);
    }

    const recordPayload: NewSessionRecord = {
      ...body,
      startDate,
      endDate,
      schoolId,
    };
    const result = await dao.create(recordPayload);
    message = "Session information saved successfully";
    const response = { status: "success", message, data: result };
    return response;
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }
    throw new AppError("Internal Server Error", 500);
  }
};
