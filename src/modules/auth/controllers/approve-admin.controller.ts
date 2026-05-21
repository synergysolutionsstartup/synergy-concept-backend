import { authConstants } from "@src/modules/auth/constants";
import { common } from "@src/common/_index";
import { AuthMapper } from "@src/modules/auth/mappers";

const AppError = common.errors.AppError;

interface Props {
  id: string;
  dao: any;
}

export const approveAdminController = async (props: Props) => {
  const { id, dao } = props;
  const { authMessage } = authConstants;

  const account = await dao.findAccountById(id);
  if (!account) {
    throw new AppError(authMessage.userNotFound, 404);
  }

  if (account.role !== common.constants.userRole.admin) {
    throw new AppError("Only admin users can be approved via this endpoint.", 400);
  }

  const updated = await dao.updateAccount(id, { isApproved: true });
  const accountResponse = AuthMapper.mapAccountEntityToResponseDto(updated);
  return {
    status: "success",
    message: "Admin account approved successfully.",
    data: { account: accountResponse },
  };
};
