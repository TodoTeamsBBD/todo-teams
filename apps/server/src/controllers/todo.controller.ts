import { Request, Response } from 'express';
import * as todoService from '../services/todo.service';

export const getAll = async (_: Request, res: Response) => {
  const todos = await todoService.getTodos();
  res.json(todos);
};

export const getOne = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const todo = await todoService.getTodo(id);
  if (!todo) 
    res.status(404).send('Todo not found');
  else
    res.json(todo);
};

export const create = async (req: Request, res: Response) => {
  const todo = await todoService.createTodo(req.body);
  res.status(201).json(todo);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  const updatedTodo = await todoService.updateTodo(id, req.body);
  res.json(updatedTodo);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params['id']);
  await todoService.deleteTodo(id);
  res.status(204).send();
};
