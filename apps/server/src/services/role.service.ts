import prisma from '../utils/prisma';

export const getRoles = () => prisma.roles.findMany();

export const getRole = (id: number) => prisma.roles.findUnique({ where: { id } });

export const createRole = (data: any) => prisma.roles.create({ data });

export const updateRole = (id: number, data: any) => prisma.roles.update({ where: { id }, data });

export const deleteRole = (id: number) => prisma.roles.delete({ where: { id } });
