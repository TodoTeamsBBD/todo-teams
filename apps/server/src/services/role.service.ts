import prisma from '../utils/prisma';

export const getRoleById = (id: number) => prisma.roles.findUnique({ where: { id } });

export const getRoles = () => prisma.roles.findMany();