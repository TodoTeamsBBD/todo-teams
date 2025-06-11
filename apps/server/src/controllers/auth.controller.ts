import { Request, Response } from 'express';
import argon2 from 'argon2';
import * as userService from '../services/user.service';
import { signJwt, verifyJwt } from '../utils/jwt';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { isValidEmail, isValidPassword, isValidUsername, sanitizeInput } from '../utils/sanitization';

export const signup = async (req: Request, res: Response) => {
    const rawName = req.body?.name || '';
    const rawEmail = req.body?.email || '';
    const rawPassword = req.body?.password || '';

    const name = sanitizeInput(rawName);
    const email = sanitizeInput(rawEmail.toLowerCase());
    const password = sanitizeInput(rawPassword);

    if (!name || !email || !password) {
        return res.status(400).send('Name, email and password are required');
    }

    if (!isValidEmail(email)) {
        return res.status(400).send("Please enter a valid email");
    }
    if (!isValidPassword(password)) {
        return res.status(400).send("Please enter a valid password (minimum length 8)");
    }
    if (!isValidUsername(name)) {
        return res.status(400).send("Please enter a valid name");
    }

    if (await userService.getUserByEmail(email)) {
        return res.status(409).send("Email already exists");
    }
    
    const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
    });
    const secret2FA = speakeasy.generateSecret({ name: `TodoTeams (${email})` });

    const user = await userService.createUser(name, email, passwordHash, secret2FA.base32, new Date());

    const token = signJwt({ userId: user.id, name: user.username, is2FAverified: false, is2FAverifiedSession: false});

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ 
        message: 'User signed up successfully. Proceed to 2FA', 
        userId: user.id, 
        name: user.username,
    });
};

export const signup2FA = async (req: Request, res: Response) => {
    let token = req.cookies['access_token'];
    const code2FA = req.body?.code2FA;

    if (isNaN(code2FA)) {
        return res.status(400).send('Please enter a valid 2FA code');
    }

    if (!token) {
        return res.status(401).send('Authentication token missing');
    }
    
    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
        return res.status(401).send('Invalid or expired authentication token');
    }
    
    let user = await userService.getUserById(payload.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    if (user.two_factor_verified) {
        return res.status(403).send("Two factor authentication has already been enabled");
    }

    const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: code2FA,
        window: 1,
    });

    if (!verified) 
        return res.status(401).send("Invalid 2FA token");

    await userService.set2FAverified(user.id);

    token = signJwt({ userId: user.id, name: user.username, is2FAverified: true, is2FAverifiedSession: true});

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ 
        message: '2FA enabled. User has logged in successfully', 
        userId: user.id, 
        name: user.username
    });
}

export const getQR = async (req: Request, res: Response) => {
    let token = req.cookies['access_token'];

    if (!token) {
        return res.status(401).send('Authentication token missing');
    }
    
    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
        return res.status(401).send('Invalid or expired authentication token');
    }
    
    let user = await userService.getUserById(payload.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    if (user.two_factor_verified) {
        return res.status(403).send("Two factor authentication has already been enabled");
    }

    const otpauthUrl = speakeasy.otpauthURL({
        secret: user.two_factor_secret,
        label: `TodoTeams (${user.email})`,
        issuer: `TodoTeams`,
        encoding: 'base32',
    });

    const qr = await QRCode.toDataURL(otpauthUrl);

    return res.status(200).json({ qrCodeUrl: qr });
}

export const login = async (req: Request, res: Response) => {
    const rawEmail = req.body?.email || '';
    const rawPassword = req.body?.password || '';

    const email = sanitizeInput(rawEmail.toLowerCase());
    const password = sanitizeInput(rawPassword);

    if (!isValidEmail(email)) {
        return res.status(400).send("Please enter a valid email");
    }
    if (!isValidPassword(password)) {
        return res.status(400).send("Please enter a valid password (minimum length 8)");
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
        return res.status(401).send("Email or password is incorrect");
    }

    const valid = await argon2.verify(user.password_hash, password);
    if (!valid) {
        return res.status(401).send("Email or password is incorrect");
    }

    if (!user.two_factor_verified) {
        const token = signJwt({ userId: user.id, name: user.username, is2FAverified: false, is2FAverifiedSession: false});

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({ 
            message: 'User verified. Two factor authentication must be enabled to continue', 
            userId: user.id, 
            name: user.username
        });
    }

    const token = signJwt({ userId: user.id, name: user.username, is2FAverified: user.two_factor_verified, is2FAverifiedSession: false});

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ 
        message: 'User verified. Proceed to 2FA to complete login process', 
        userId: user.id, 
        name: user.username
    });
};

export const login2FA = async (req: Request, res: Response) => {
    let token = req.cookies['access_token'];
    const code2FA = req.body?.code2FA;

    if (isNaN(code2FA)) {
        return res.status(400).send('Please enter a valid 2FA code');
    }
    
    if (!token) {
        return res.status(401).send('Authentication token missing');
    }
    
    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
        return res.status(401).send('Invalid or expired authentication token');
    }
    
    let user = await userService.getUserById(payload.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    if (!user.two_factor_verified) {
        return res.status(403).send("Two factor authentication has not been enabled yet");
    }

    const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: code2FA,
        window: 1
    });

    if (!verified) 
        return res.status(401).send("Invalid 2FA token");

    token = signJwt({ userId: user.id, name: user.username, is2FAverified: true, is2FAverifiedSession: true});

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ 
        message: '2FA verified. User has logged in successfully', 
        userId: user.id, 
        name: user.username
    });
}

export const logout = (_: Request, res: Response) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    return res.send('Logged out successfully');
};


export const getUserDetails = async (req: Request, res: Response) => {
    const token = req.cookies['access_token'];
    if (!token) {
        return res.status(401).send('Authentication token missing');
    }
    
    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
        return res.status(403).send('Invalid or expired token');
    }

    return res.status(200).json({
        userId: payload.userId, 
        name: payload.name, 
        verified2FA: payload.is2FAverified, 
        verified2FAsession: payload.is2FAverifiedSession
    });
}