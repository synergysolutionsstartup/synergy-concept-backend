import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { AuthMapper } from "@src/modules/auth/mappers";

const AppError = common.errors.AppError;

type AccountEntity = AccountTypes.Entities.AccountEntity;

type Props = {
  dao: any;
  requestUser: any;
  role?: string;
};

export const readUsersController = async (props: Props) => {
  try {
    const { dao, requestUser, role } = props;
    const { userRole } = common.constants;

    const areAllRolesAllowed = requestUser.role === userRole.superAdmin;
    const isAdmin = requestUser.role === userRole.admin;

    if (!areAllRolesAllowed && !isAdmin) {
      throw new AppError("You do not have permission to perform this action", 403);
    }

    if (isAdmin && role === userRole.superAdmin) {
      throw new AppError("Admins cannot read super admin accounts.", 403);
    }

    const allRoles = [
      userRole.superAdmin,
      userRole.admin,
      userRole.staff,
      userRole.student,
      userRole.parent,
    ];
    const nonSuperAdminRoles = [
      userRole.admin,
      userRole.staff,
      userRole.student,
      userRole.parent,
    ];

    const rolesToQuery = areAllRolesAllowed
      ? role
        ? [role]
        : allRoles
      : role
      ? [role]
      : nonSuperAdminRoles;

    const users = await dao.readAccountsByRoles(rolesToQuery);
    const sanitizedUsers = users.map(AuthMapper.mapAccountEntityToResponseDto);

    return {
      status: "success",
      message: "Users retrieved successfully.",
      data: sanitizedUsers,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to read users.", 500);
  }
};
