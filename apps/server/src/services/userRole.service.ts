import prisma from '../utils/prisma';

export const getUserRoleById = (id: number) => prisma.user_roles.findUnique({ where: { id } });

export const findUserRoleIfExists = (userId: string, roleId: number, teamId : number|null) => prisma.user_roles.findFirst({
    where: {
        user_id: userId,
        role_id: roleId, 
        team_id: teamId
    }
})

export const createUserRole = (
  userId: string,
  teamId: number,
  roleId: number
) => prisma.user_roles.create({
  data: {
    user_id: userId,
    team_id: teamId,
    role_id: roleId
  }
});

export const updateUserRole = (id: number, newRoleId: number) => prisma.user_roles.update({ 
    where: { id }, 
    data: { role_id: newRoleId },
});

export const deleteUserRole = (id: number) => prisma.user_roles.delete({ where: { id } });
