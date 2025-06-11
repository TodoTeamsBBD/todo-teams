import { Request, Response } from 'express';
import * as teamService from '../services/team.service';
import * as userRoleService from '../services/userRole.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { rolesEnum } from '../utils/rolesEnum';
import { sanitizeInput } from '../utils/sanitization';

export const getAllPaginated = async (req: AuthenticatedRequest, res: Response) => {
  let page = Number(req.query['page']);
  let pageSize = Number(req.query['pageSize']);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(pageSize) || pageSize < 1) pageSize = 5;

  const userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.AccessAdministrator, null);

  if (!userRole) {
    return res.status(403).json({ "message": "Access denied: You do not have permission to perform this action." });
  }

  const teams = await teamService.getTeamsPaginated(page, pageSize);
  return res.status(200).json(teams);
};

export const getTeamsForUser = async (req: AuthenticatedRequest, res: Response) => {
  const teams = await teamService.getTeamsForUser(req.user.id);
 
  return res.status(200).json(teams);
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const rawTeamName = req.body?.teamName || '';

  const teamName = sanitizeInput(rawTeamName);

  if (!teamName){
    return res.status(400).json({ "message": "A team name is required." });
  }

  const team = await teamService.createTeam(teamName, new Date());
  const userRole = await userRoleService.createUserRole(req.user.id, team.id, rolesEnum.TeamLead);

  return res.status(201).json({ message: 'Team created successfully', team, userRole });
};

export const getStats = async (req: AuthenticatedRequest, res: Response) => {
  const teamId = Number(req.params['id']);

  if (isNaN(teamId)) {
    return res.status(400).json({ "message": "Valid team id is required" });
  }

  const team = await teamService.getTeamById(teamId);
  if (!team) {
    return res.status(404).json({ "message": "Team not found" })
  }

  const userRoleCheck1 = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamMember, team.id);
  const userRoleCheck2 = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, team.id);

  if (!userRoleCheck1 && !userRoleCheck2) {
    return res.status(403).json({ "message": "Access denied: You do not have permission to perform this action." });
  }

  const totalCount = teamService.totalTodos(team.id);
  const completedCount = teamService.completedCount(team.id);
  const incompleteCount = teamService.incompleteCount(team.id);
  const avgTimeToComplete = teamService.avgTimeToComplete(team.id);

  return res.status(200).json({totalCount, completedCount, incompleteCount, avgTimeToComplete});
}

