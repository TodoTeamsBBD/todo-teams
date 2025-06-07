import { Request, Response } from 'express';
import * as todoService from '../services/todo.service';
import * as userRoleService from '../services/userRole.service';
import * as userService from '../services/user.service';
import * as teamService from '../services/team.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { rolesEnum } from '../utils/rolesEnum';

export const getToDo = async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params['id']);

  if (isNaN(id))
  {
    return res.status(400).send('Todo id is required');
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

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const title = req.body?.title;
  const description = req.body?.description;
  const assignedTo = req.body?.assignedTo;
  const teamId = Number(req.body?.teamId);

  if (!title || !description || !assignedTo || isNaN(teamId)) {
    return res.status(400).send('Title, description, assigned member, and team id are all required');
  }

  const assignedUser = await userService.getUserById(assignedTo);
  if (!assignedUser) {
    return res.status(404).send("User not found");
  }

  const todoTeam = await teamService.getTeamById(teamId);
  if (!assignedUser) {
    return res.status(404).send("Team not found");
  }

  let userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamLead, todoTeam.team_id);
  if (!userRole) {
    userRole = await userRoleService.findUserRoleIfExists(req.user.id, rolesEnum.TeamMember, todoTeam.team_id);
    if (!userRole)
      return res.status(403).send("Access denied: You do not have permission to perform this action." );
  }

  if (userRole.role == rolesEnum.TeamMember) {
    if (userRole.userId != assignedUser.id) {
      return res.status(403).send("You do not have permission to create a todo assigned to another member" );
    }
  }
  else {
    let assignedUserRoleCheck = await userRoleService.findUserRoleIfExists(assignedUser.id, rolesEnum.TeamLead, todoTeam.team_id);
    if (!assignedUserRoleCheck) {
      assignedUserRoleCheck = await userRoleService.findUserRoleIfExists(assignedUser.id, rolesEnum.TeamMember, todoTeam.team_id);
      if (!assignedUserRoleCheck)
        return res.status(403).send("Cannot assign a task to a member not in the team" );
    }
  }

  const todo = await todoService.createTodo(title, description, req.user.id, assignedUser.id, todoTeam.id, new Date(), null);
  return res.status(201).json(todo);
};

export const update = async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params['id']);
  const title = req.body.title;
  const description = req.body.description;
  const assignedTo = req.body.assignedTo;
  const completed = req.body.completed;

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

  if (userRole.role == rolesEnum.TeamMember) {
    if (userRole.userId != todoToUpdate.user_id) {
      return res.status(403).send("You do not have permission to update a todo assigned to another member" );
    }

    if (assignedTo) {
      if (assignedTo != userRole.user_id) {
        return res.status(403).send("You do not have permission to assign a todo to another member" );
      }
    }
  }

  todoToUpdate.title = title ? title : todoToUpdate.title;
  todoToUpdate.description = description ? description : todoToUpdate.description;
  todoToUpdate.assigned_to = assignedTo ? assignedTo : todoToUpdate.assigned_to;
  if (typeof completed === 'boolean') {
    todoToUpdate.completed_at = completed ? new Date() : null;
  }

  const updatedTodo = await todoService.updateTodo(id, todoToUpdate.title, todoToUpdate.description, todoToUpdate.assigned_to, todoToUpdate.completed_at);
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

  if (userRole.role == rolesEnum.TeamMember) {
    if (userRole.userId != todoToDelete.user_id) {
      return res.status(403).send("You do not have permission to delete a todo assigned to another member" );
    }
  }

  await todoService.deleteTodo(id);
  return res.status(204).send();
};
