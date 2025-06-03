import prisma from '../utils/prisma';

export const getUsers = () => prisma.users.findMany();

export const getUser = (id: number) => prisma.users.findUnique({ where: { id } });

export const createUser = (data: any) => prisma.users.create({ data });

export const updateUser = (id: number, data: any) => prisma.users.update({ where: { id }, data });

export const deleteUser = (id: number) => prisma.users.delete({ where: { id } });
