import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getAllPaginated = async (req: Request, res: Response) => {
  const name = req.query['name'];
  let page = Number(req.query['page']);
  let pageSize = Number(req.query['pageSize']);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(pageSize) || pageSize < 1) pageSize = 10;

  if (name && typeof name === 'string') {
    const users = await userService.searchUserByName(name, page, pageSize);
    return res.json(users);
  }
  else {
    const users = await userService.getUsersPaginated(page, pageSize);

    return res.json(users);
  }
};