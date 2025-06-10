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

export const totalTodos = (teamId: number) =>  prisma.todos.count({
  where: { team_id: teamId }
});

export const completedCount = (teamId: number) => prisma.todos.count({
  where: { team_id: teamId, completed_at: { not: null } }
});

export const incompleteCount = (teamId: number) => prisma.todos.count({
  where: { team_id: teamId, completed_at: null }
});

export const avgTimeToComplete = async (teamId: number) => {
  const todos = await prisma.todos.findMany({
    where: {
      team_id: teamId,
      completed_at: { not: null }
    },
    select: {
      created_at: true,
      completed_at: true
    }
  });

  if (!todos) {
    return null
  }

  const totalMs = todos.reduce((sum, todo) => {
    return sum + (todo.completed_at!.getTime() - todo.created_at.getTime());
  }, 0);

  return todos.length ? totalMs / todos.length : 0;
};
