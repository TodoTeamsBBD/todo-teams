import { Request, Response } from 'express';
import * as roleService from '../services/role.service';
import * as userRoleService from '../services/userRole.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { rolesEnum } from '../utils/rolesEnum';

export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  const userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.AccessAdministrator, null);

  if (!userRole) {
    return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  const roles = await roleService.getRoles();
  return res.status(200).json(roles);
};
