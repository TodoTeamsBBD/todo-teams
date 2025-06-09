import xss from 'xss';

export function sanitizeInput(input: string): string {
    return xss(input.trim());
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
}

export function isValidUsername(name: string): boolean {
    return typeof name === 'string' && name.length > 0 && name.length <= 30;
}

export function isValidPassword(password: string): boolean {
    return typeof password === 'string' && password.length >= 8 && password.length <= 255;
}