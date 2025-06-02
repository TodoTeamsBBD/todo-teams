import { Request, Response } from 'express';
import * as roleService from '../services/role.service';

export const getAll = async (_: Request, res: Response) => {
  const roles = await roleService.getRoles();
  res.json(roles);
};

export const getOne = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const role = await roleService.getRole(id);
  if (!role) 
    res.status(404).send('Role not found');
  else
    res.json(role);
};

export const create = async (req: Request, res: Response) => {
  const role = await roleService.createRole(req.body);
  res.status(201).json(role);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const updatedRole = await roleService.updateRole(id, req.body);
  res.json(updatedRole);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  await roleService.deleteRole(id);
  res.status(204).send();
};
