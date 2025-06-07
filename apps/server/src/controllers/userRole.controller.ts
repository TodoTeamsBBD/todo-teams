import { Request, Response } from 'express';
import * as userRoleService from '../services/userRole.service';

export const getAll = async (_: Request, res: Response) => {
  const userRoles = await userRoleService.getUserRoles();
  res.json(userRoles);
};

export const getOne = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const userRole = await userRoleService.getUserRole(id);
  if (!userRole) 
    res.status(404).send('UserRole not found');
  else 
    res.json(userRole);
};

export const create = async (req: Request, res: Response) => {
  const userRole = await userRoleService.createUserRole(req.body);
  res.status(201).json(userRole);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const updatedUserRole = await userRoleService.updateUserRole(id, req.body);
  res.json(updatedUserRole);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  await userRoleService.deleteUserRole(id);
  res.status(204).send();
};
