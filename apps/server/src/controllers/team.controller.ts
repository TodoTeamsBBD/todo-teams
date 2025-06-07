import { Request, Response } from 'express';
import * as teamService from '../services/team.service';
import * as userRoleService from '../services/userRole.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { rolesEnum } from '../utils/rolesEnum';

export const getAllPaginated = async (req: AuthenticatedRequest, res: Response) => {
  const page = Number(req.query['page']);
  const pageSize = Number(req.query['pageSize']);

  const userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.AccessAdministrator);

  if (!userRole) {
    return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  const teams = await teamService.getTeamsPaginated(page, pageSize);
  return res.status(200).json(teams);
};

export const getTeamsForUser = async (req: AuthenticatedRequest, res: Response) => {
  const teams = await teamService.getTeamsForUser(req.user.userId);
 
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