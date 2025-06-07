import prisma from '../utils/prisma';

export const getTodoById = (id: number) => prisma.todos.findUnique({ where: { id } });

export const getTodosOfTeam = (
  teamId: number,
  userId?: string | null,
  completed?: boolean | null
) => {
  const where: any = {
    team_id: teamId
  };

  if (userId) {
    where.assigned_to = userId;
  }

  if (completed === true) {
    where.completed_at = {
      not: null
    };
  } else if (completed === false) {
    where.completed_at = null;
  }

  return prisma.todos.findMany({ where });
};

export const createTodo = (
  title: string,
  description: string,
  createdBy: string,
  assignedTo: string,
  teamId: number,
  createdAt: Date,
  completedAt: Date | null
) => prisma.todos.create({
  data: {
    title: title,
    description: description,
    created_by: createdBy,
    assigned_to: assignedTo,
    team_id: teamId,
    created_at: createdAt,
    completed_at: completedAt
  }
});


export const updateTodo = (
  id: number,
  completedAt : Date|null,
  title?: string,
  description?: string,
  assignedTo?: string
) => {
  const data: Record<string, any> = {};

  if (title !== undefined) data['title'] = title;
  if (description !== undefined) data['description'] = description;
  if (assignedTo !== undefined) data['assigned_to'] = assignedTo;
  if (completedAt !== undefined) data['completed_at'] = completedAt;

  return prisma.todos.update({
    where: { id },
    data,
  });
};

export const deleteTodo = (id: number) => prisma.todos.delete({ where: { id } });
