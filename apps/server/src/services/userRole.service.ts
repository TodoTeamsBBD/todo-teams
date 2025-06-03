import prisma from '../utils/prisma';

export const getUserRoles = () => prisma.user_roles.findMany();

export const getUserRole = (id: number) => prisma.user_roles.findUnique({ where: { id } });

export const createUserRole = (data: any) => prisma.user_roles.create({ data });

export const updateUserRole = (id: number, data: any) => prisma.user_roles.update({ where: { id }, data });

export const deleteUserRole = (id: number) => prisma.user_roles.delete({ where: { id } });
