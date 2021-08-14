import jwt from 'jsonwebtoken';
import { getJWTSecret, getUserByUsername } from '@project-miuna/utils'
interface AuthResult {
    success: boolean,
    message: string,
    token?: string
}
export const authUser = async (usernameOrEmail: string, password: string): Promise<AuthResult> => {
    return new Promise((resolve, reject) => {
        getUserByUsername(usernameOrEmail).then(thisUser => {
            if (thisUser.password === password) {
                const payload = { id: thisUser.id, sub: usernameOrEmail, username: thisUser.username, email: thisUser.email, iat: new Date().getTime() };
                const token = jwt.sign(payload, getJWTSecret() as string, { expiresIn: '120d' })
                resolve({
                    success: true,
                    message: "Auth ok",
                    token: token,
                })
            } else {
                reject({
                    success: false,
                    message: "Username/Email or Password is incorrect",
                });
            }
        }).catch(e => {
            reject({
                success: false,
                message: "Username/Email or Password is incorrect",
            });
        })
    })
}