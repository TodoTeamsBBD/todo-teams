import prisma from '../utils/prisma';

export const getTeams = () => prisma.teams.findMany();

export const getTeam = (id: number) => prisma.teams.findUnique({ where: { id } });

export const createTeam = (data: any) => prisma.teams.create({ data });

export const updateTeam = (id: number, data: any) => prisma.teams.update({ where: { id }, data });

export const deleteTeam = (id: number) => prisma.teams.delete({ where: { id } });
