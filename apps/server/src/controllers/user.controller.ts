import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getAllPaginated = async (req: Request, res: Response) => {
  const name = req.query['name'];
  const page = Number(req.query['page']);
  const pageSize = Number(req.query['pageSize']);

  if (name && typeof name === 'string') {
    const users = await userService.searchUserByName(name, page, pageSize);
    return res.json(users);
  }
  else {
    const users = await userService.getUsersPaginated(page, pageSize);

    return res.json(users);
  }
};