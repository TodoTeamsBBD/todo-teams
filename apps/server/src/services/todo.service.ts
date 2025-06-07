import prisma from '../utils/prisma';

export const getTodos = () => prisma.todos.findMany();

export const getTodo = (id: number) => prisma.todos.findUnique({ where: { id } });

export const createTodo = (data: any) => prisma.todos.create({ data });

export const updateTodo = (id: number, data: any) => prisma.todos.update({ where: { id }, data });

export const deleteTodo = (id: number) => prisma.todos.delete({ where: { id } });
