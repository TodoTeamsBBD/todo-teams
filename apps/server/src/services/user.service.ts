import prisma from '../utils/prisma';

export const getUsersPaginated = (page = 1, pageSize = 10) => prisma.users.findMany({
    select: {
        id: true,
        username: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { id: 'asc'}
});

export const getUserById = (id: string) => prisma.users.findUnique({ where: { id } });

export const getUserByEmail = (email: string) => prisma.users.findUnique({where : {email : email}});

export const searchUserByName = (searchString: string, page = 1, pageSize = 10) => {
    if (!searchString.trim()) 
        return []; 
    else return prisma.users.findMany({
        select: {
            id: true,
            username: true,
        },
        where: {
            username: {
                startsWith: searchString,
                mode: 'insensitive',
            }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc'}
    })
};

export const createUser = (username: string, email: string, passwordHash: string, twoFactorSecret: string, createdAt: Date) => prisma.users.create({ 
    username: username, 
    email: email, 
    password_hash: passwordHash,
    two_factor_secret: twoFactorSecret,
    created_at: createdAt
});