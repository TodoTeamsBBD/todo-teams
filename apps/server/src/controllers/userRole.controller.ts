import { Request, Response } from 'express';
import * as userRoleService from '../services/userRole.service';
import * as userService from '../services/user.service';
import * as teamService from '../services/team.service';
import * as roleService from '../services/role.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { rolesEnum } from '../utils/rolesEnum';

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.body?.userId;
  const teamId = Number(req.body?.teamId);

  if (!userId || isNaN(teamId)) {
    return res.status(400).send('User and team are required');
  }

  const userToAdd = await userService.getUserById(userId);
  if (!userToAdd) {
    return res.status(404).send("User not found")
  }
  const teamToAddTo = await teamService.getTeamById(teamId);
  if (!teamToAddTo) {
    return res.status(404).send("Team not found")
  }
  const userRoleCheck1 = await userRoleService.findUserRoleIfExists(userToAdd.id, rolesEnum.TeamMember, teamId);
  const userRoleCheck2 = await userRoleService.findUserRoleIfExists(userToAdd.id, rolesEnum.TeamLead, teamId);

  if (userRoleCheck1 || userRoleCheck2) {
    return res.status(403).send("User is already in the team")
  }

  const userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, teamId);
  if (!userRole) {
    return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  const userRoleCreated = await userRoleService.createUserRole(userToAdd.id, teamId, rolesEnum.TeamMember);

  return res.status(201).json({ message: "Team member added successfully", userRoleCreated });
};

export const update = async (req: AuthenticatedRequest, res: Response) => {
  const userRoleId = Number(req.params['userRoleId']);
  const role = Number(req.body?.role);

  if (isNaN(userRoleId) || isNaN(role)) {
    return res.status(400).send('UserRoleId and role is required');
  }

  let userRoleToUpdate = await userRoleService.getUserRoleById(userRoleId);
  if (!userRoleToUpdate) {
    return res.status(400).send("User role not found")
  }

  let roleToUpdateTo = await roleService.getRoleById(role);
  if (!roleToUpdateTo) {
    return res.status(400).send("Role not found")
  }

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, userRoleToUpdate.teamId);
  if (!userRole) {
    userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.AccessAdministrator);
    if (!userRole)
      return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  const updatedUserRole = await userRoleService.updateUserRole(userRoleId, role); 
  return res.status(200).json({ message: "User role updated successfully", updatedUserRole });
};

export const remove = async (req: AuthenticatedRequest, res: Response) => {
  const userRoleId = Number(req.params['userRoleId']);

  if (isNaN(userRoleId)) {
    return res.status(400).send('UserRoleId is required');
  }

  let userRoleToRemove = await userRoleService.getUserRoleById(userRoleId);
  if (!userRoleToRemove) {
    return res.status(400).send("User role not found")
  }

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, userRoleToRemove.teamId);
  if (!userRole) {
    userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.AccessAdministrator);
    if (!userRole)
      return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  await userRoleService.deleteUserRole(userRoleToRemove.id);
  return res.status(204).send();
};
