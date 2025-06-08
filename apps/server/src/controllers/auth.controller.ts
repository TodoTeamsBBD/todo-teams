import { Request, Response } from 'express';
import argon2 from 'argon2';
import * as userService from '../services/user.service';
import { signJwt } from '../utils/jwt';

export const signup = async (req: Request, res: Response) => {
    const name = req.body?.name;
    const email = req.body?.email;
    const password = req.body?.password;

    if (!name || !email || !password) {
        return res.status(400).send('Name, email and password are required');
    }

    // email rules check

    if (await userService.getUserByEmail(email)) {
        return res.status(409).send("Email already exists");
    }

    // Password rules check
    
    const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
    });

    const user = await userService.createUser(name, email, passwordHash, 'test', new Date());


    const token = signJwt({ userId: user.id, name: user.username});

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
    });

    return res.status(201).json({ message: 'User signed up successfully', userId: user.id, name: user.username});
};

export const login = async (req: Request, res: Response) => {
    const email = req.body?.email;
    const password = req.body?.password;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
        return res.status(401).send("Email or password is incorrect");
    }

    const valid = await argon2.verify(user.password_hash, password);
    if (!valid) {
        return res.status(401).send("Email or password is incorrect");
    }

    const token = signJwt({ userId: user.id, name: user.username});

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Logged in successfully', userId: user.id, name: user.username});
};

export const logout = (_: Request, res: Response) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    return res.send('Logged out successfully');
};
