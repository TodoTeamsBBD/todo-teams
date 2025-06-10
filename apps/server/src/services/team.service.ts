import prisma from '../utils/prisma';

export const getTeamById = (id: number) => prisma.teams.findUnique({ where: { id } });

export const getTeamsPaginated = async (page = 1, pageSize = 5) => {
  // Get the teams for the current page
  const teams = await prisma.teams.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { id: 'asc'}
  });

  // Get the total count of all teams
  const total = await prisma.teams.count();

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  // Return the paginated response structure
  return {
    data: teams,
    total: total,
    page: page,
    pageSize: pageSize,
    totalPages: totalPages
  };
};

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