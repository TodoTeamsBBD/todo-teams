import { Request, Response } from 'express';
import * as service from '../services/team.service';

export const getAll = async (_: Request, res: Response) => {
  res.json(await service.getTeams());
};

export const getOne = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const team = await service.getTeam(id);
  if (!team)
    res.status(404).send("Team not found");
  else
    res.json(team);
};

export const create = async (req: Request, res: Response) => {
  const team = await service.createTeam(req.body);
  res.status(201).json(team);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  res.json(await service.updateTeam(id, req.body));
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  await service.deleteTeam(id);
  res.status(204).send();
};
