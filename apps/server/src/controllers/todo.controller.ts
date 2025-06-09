import { Request, Response } from 'express';
import * as todoService from '../services/todo.service';
import * as userRoleService from '../services/userRole.service';
import * as userService from '../services/user.service';
import * as teamService from '../services/team.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { rolesEnum } from '../utils/rolesEnum';
import { sanitizeInput } from '../utils/sanitization';
import { validate as isUuid } from 'uuid';

export const getToDo = async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params['id']);

  if (isNaN(id)) {
    return res.status(400).send('Todo id must be a valid number');
  }

  const todo = await todoService.getTodoById(id);
  if (!todo) {
    return res.status(404).send('Todo not found');
  }

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, todo.team_id);
  if (!userRole) {
    userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamMember, todo.team_id);
    if (!userRole)
      return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  return res.status(200).json(todo);
};

export const getToDosForTeam = async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params['id']);
  const usersToDos = req.query['usersToDos'] === 'true';
  const completedToDos = req.query['completedToDos'];
  
  let completed: boolean | null = null;

  if (typeof completedToDos === 'string') {
    if (completedToDos === 'true') {
      completed = true;
    } else if (completedToDos === 'false') {
      completed = false;
    }
  }

  if (isNaN(id)) {
    return res.status(400).send('Team id must be a valid number');
  }

  const team = await teamService.getTeamById(id);
  if (!team) {
    return res.status(404).send('Team not found');
  }

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, team.id);
  if (!userRole) {
    userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamMember, team.id);
    if (!userRole)
      return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  const todos = await todoService.getTodosOfTeam(team.id, usersToDos ? req.user.id : null, completed);

  return res.status(200).json(todos);
}

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const rawTitle = req.body?.title || '';
  const rawDescription = req.body?.description || '';
  const assignedTo = req.body?.assignedTo;
  const teamId = Number(req.body?.teamId);

  const title = sanitizeInput(rawTitle);
  const description = sanitizeInput(rawDescription);

  if (!title || !description || !assignedTo || !isUuid(assignedTo) || isNaN(teamId)) {
    return res.status(400).send('Valid title, description, assigned member, and team id is required');
  }

  const assignedUser = await userService.getUserById(assignedTo);
  if (!assignedUser) {
    return res.status(404).send("User not found");
  }

  const todoTeam = await teamService.getTeamById(teamId);
  if (!todoTeam) {
    return res.status(404).send("Team not found");
  }

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, todoTeam.id);
  if (!userRole) {
    userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamMember, todoTeam.id);
    if (!userRole)
      return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  if (userRole.role_id == rolesEnum.TeamMember) {
    if (userRole.user_id != assignedUser.id) {
      return res.status(403).send("You do not have permission to create a todo assigned to another member" );
    }
  }
  else {
    let assignedUserRoleCheck = await userRoleService.findUserRoleIfExists(assignedUser.id, rolesEnum.TeamLead, todoTeam.id);
    if (!assignedUserRoleCheck) {
      assignedUserRoleCheck = await userRoleService.findUserRoleIfExists(assignedUser.id, rolesEnum.TeamMember, todoTeam.id);
      if (!assignedUserRoleCheck)
        return res.status(403).send("Cannot assign a task to a member not in the team" );
    }
  }

  const todo = await todoService.createTodo(title, description, req.user.id, assignedUser.id, todoTeam.id, new Date(), null);
  return res.status(201).json(todo);
};

export const update = async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params['id']);
  const rawTitle = req.body.title;
  const rawDescription = req.body.description;
  const assignedTo = req.body.assignedTo;
  const completed = req.body.completed;

  const title = sanitizeInput(rawTitle);
  const description = sanitizeInput(rawDescription);

  if (isNaN(id)) {
    return res.status(400).send('Todo id is required');
  }

  let todoToUpdate = await todoService.getTodoById(id);
  if (!todoToUpdate) {
    return res.status(404).send("Todo not found");
  }

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, todoToUpdate.team_id);
  if (!userRole) {
    userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamMember, todoToUpdate.team_id);
    if (!userRole)
      return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  if (userRole.role_id == rolesEnum.TeamMember) {
    if (userRole.user_id != todoToUpdate.assigned_to) {
      return res.status(403).send("You do not have permission to update a todo assigned to another member" );
    }

    if (assignedTo) {
      if (assignedTo != userRole.user_id) {
        return res.status(403).send("You do not have permission to assign a todo to another member" );
      }
    }
  }

  if (assignedTo) {
    if (!isUuid(assignedTo)) {
      return res.status(400).send("Please enter a valid assigned to")
    }

    const assignedUser = await userService.getUserById(assignedTo);
    if (!assignedUser) {
      return res.status(404).send("User not found");
    }

    let assignedUserRoleCheck = await userRoleService.findUserRoleIfExists(assignedUser.id, rolesEnum.TeamLead, todoToUpdate.team_id);
    if (!assignedUserRoleCheck) {
      assignedUserRoleCheck = await userRoleService.findUserRoleIfExists(assignedUser.id, rolesEnum.TeamMember, todoToUpdate.team_id);
      if (!assignedUserRoleCheck)
        return res.status(403).send("Cannot assign a task to a member not in the team" );
    }
  }

  todoToUpdate.title = title ? title : todoToUpdate.title;
  todoToUpdate.description = description ? description : todoToUpdate.description;
  todoToUpdate.assigned_to = assignedTo ? assignedTo : todoToUpdate.assigned_to;
  if (typeof completed === 'string') {
    todoToUpdate.completed_at = completed === 'true' ? new Date() : null;
  }

  const updatedTodo = await todoService.updateTodo(id, todoToUpdate.completed_at, todoToUpdate.title!, todoToUpdate.description!, todoToUpdate.assigned_to!);
  return res.status(200).json(updatedTodo);
};

export const remove = async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params['id']);

  if (isNaN(id)) {
    return res.status(400).send('Todo id is required');
  }

  const todoToDelete = await todoService.getTodoById(id);
  if (!todoToDelete) {
    return res.status(404).send("Todo not found");
  }

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, todoToDelete.team_id);
  if (!userRole) {
    userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamMember, todoToDelete.team_id);
    if (!userRole)
      return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  if (userRole.role_id == rolesEnum.TeamMember) {
    if (userRole.user_id != todoToDelete.assigned_to) {
      return res.status(403).send("You do not have permission to delete a todo assigned to another member" );
    }
  }

  await todoService.deleteTodo(id);
  return res.status(204).send();
};
