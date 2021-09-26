export const getJWTSecret = (): string => {
    if (typeof process.env.JWT_SECRET == 'undefined') console.error('[ERROR] (JWT) secret is undefined')
    return process.env.JWT_SECRET || '';
}