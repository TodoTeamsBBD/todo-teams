import prisma from '../utils/prisma';

export const getTeamById = (id: number) => prisma.teams.findUnique({ where: { id } });

export const getTeamsPaginated = (page = 1, pageSize = 10) => prisma.teams.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { id: 'asc'}
});

export const getTeamsForUser = (userId: string) => prisma.user_roles.findMany({
    where: {
        user_id: userId,
    },
    include: {
        teams: true,
        roles: true,
    }
})

export const createTeam = (teamName: string, createdAt: Date) =>
  prisma.teams.create({
    data: {
      name: teamName,
      created_at: createdAt
    }
});

export const deleteTeam = (teamId: number) => prisma.teams.delete({where : {id: teamId}});