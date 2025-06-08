import { Request, Response } from 'express';
import * as teamService from '../services/team.service';
import * as userRoleService from '../services/userRole.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { rolesEnum } from '../utils/rolesEnum';

export const getAllPaginated = async (req: AuthenticatedRequest, res: Response) => {
  let page = Number(req.query['page']);
  let pageSize = Number(req.query['pageSize']);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(pageSize) || pageSize < 1) pageSize = 10;

  const userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.AccessAdministrator, null);

  if (!userRole) {
    return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  const teams = await teamService.getTeamsPaginated(page, pageSize);
  return res.status(200).json(teams);
};

export const getTeamsForUser = async (req: AuthenticatedRequest, res: Response) => {
  const teams = await teamService.getTeamsForUser(req.user.id);
 
  res.status(200).json(teams);
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const teamName = req.body.teamName;

  if (!teamName || teamName.trim() === ""){
    res.status(400).send("A team name is required.");
    return
  }

  const team = await teamService.createTeam(teamName, new Date());
  const userRole = await userRoleService.createUserRole(req.user.id, team.id, rolesEnum.TeamLead);

  res.status(201).json({ message: 'Team created successfully', team, userRole });
};