import { Request, Response } from 'express';
import * as userRoleService from '../services/userRole.service';
import * as userService from '../services/user.service';
import * as teamService from '../services/team.service';
import * as roleService from '../services/role.service';
import * as todoService from '../services/todo.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { rolesEnum } from '../utils/rolesEnum';
import { validate as isUuid } from 'uuid';

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.body?.userId;
  const teamId = Number(req.body?.teamId);

  if (!userId || !isUuid(userId) || isNaN(teamId)) {
    return res.status(400).send('Valid user and team are required');
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

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.AccessAdministrator, null);
  if (!userRole) {
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

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamMember, userRoleToRemove.team_id);
  if (userRole) {
    if (userRole.id !== userRoleToRemove.id) {
      return res.status(403).send("Access denied: You do not have permission to perform this action.");
    }
  }
  else {
    userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, userRoleToRemove.team_id);
    if (!userRole) {
      userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.AccessAdministrator, null);
      if (!userRole)
        return res.status(403).send("Access denied: You do not have permission to perform this action.");
    }
  }

  if (userRoleToRemove.role_id === rolesEnum.TeamMember) {
    const teamLead = await userRoleService.getTeamLead(userRoleToRemove.team_id!);
    if (!teamLead) {
      return res.status(500).send("There is an issue with your team structure. Please contact an access administrator to assign a team lead");
    }
    await todoService.reassignTodosToTeamLeadAssignedTo(userRoleToRemove.user_id, teamLead!.user_id);
    await todoService.reassignTodosToTeamLeadCreatedBy(userRoleToRemove.user_id, teamLead!.user_id);
  }
  else if (userRoleToRemove.role_id === rolesEnum.TeamLead) {
    const nextTeamLead = await userRoleService.getTeamLead(userRoleToRemove.team_id!, userRoleToRemove.user_id);
    if (!nextTeamLead) {
      if(await userRoleService.getTeamCount(userRoleToRemove.team_id!) > 1) {
        return res.status(403).send("Team lead cannot leave without assigning another team lead. Please contact an access administrator to assign a new team lead")
      }
      await todoService.deleteTodosByUser(userRoleToRemove.user_id);
    }
    else {
      await todoService.reassignTodosToTeamLeadAssignedTo(userRoleToRemove.user_id, nextTeamLead.user_id);
      await todoService.reassignTodosToTeamLeadCreatedBy(userRoleToRemove.user_id, nextTeamLead.user_id);
    }
  }

  await userRoleService.deleteUserRole(userRoleToRemove.id);
  return res.status(204).send();
};
