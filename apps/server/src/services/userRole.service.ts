import prisma from '../utils/prisma';
import { rolesEnum } from '../utils/rolesEnum';

export const getUserRoleById = (id: number) => prisma.user_roles.findUnique({ where: { id } });

export const findUserRoleIfExists = (userId: string, roleId: number, teamId : number|null) => prisma.user_roles.findFirst({
    where: {
        user_id: userId,
        role_id: roleId, 
        team_id: teamId
    }
})

export const getTeamMembers = (teamId: number) => prisma.user_roles.findMany({
  where: { team_id: teamId},
  select: {
    id: true,
    users: {
      select: {
        username: true,
        email: true
      }
    },
    teams: {
      select: {
        name: true
      }
    },
    roles: {
      select: {
        name: true
      }
    }
  },
});

export const getTeamLeadCount = (teamId: number) => prisma.user_roles.count({ where: { team_id: teamId}});
export const getTeamCount = (teamId: number) => prisma.user_roles.count({ where: { team_id: teamId}});

export const getTeamLead = (teamId: number, excludedTeamLeadId?: string) => prisma.user_roles.findFirst({
  where: {
    team_id: teamId,
    role_id: 2,
    ...(excludedTeamLeadId && {
      user_id: {
        not: excludedTeamLeadId,
      },
    }),
  },
});

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

export const isAccessAdmin = (userId: string) => prisma.user_roles.findFirst({
  where: {
    user_id: userId,
    team_id: null,
    role_id: rolesEnum.AccessAdministrator
  }
});