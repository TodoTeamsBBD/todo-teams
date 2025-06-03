import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getAll = async (_: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const getOne = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const user = await userService.getUser(id);
  if (!user) 
    res.status(404).send('User not found');
  else
    res.json(user);
};

export const create = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const updatedUser = await userService.updateUser(id, req.body);
  res.json(updatedUser);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  await userService.deleteUser(id);
  res.status(204).send();
};
