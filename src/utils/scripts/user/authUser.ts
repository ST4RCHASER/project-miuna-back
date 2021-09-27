import jwt from 'jsonwebtoken';
import { getJWTSecret, getUserByInfo, MongoDBClient } from '@project-miuna/utils'
import bcrypt from 'bcrypt';
interface AuthResult {
    success: boolean,
    message: string,
    token?: string
}
export const authUser = async (db: MongoDBClient, usernameOrEmail: string, password: string): Promise<AuthResult> => {
    return new Promise((resolve, reject) => {
        getUserByInfo(db, usernameOrEmail).then(thisUser => {
            bcrypt.compare(password, thisUser.password, function (err, result) {
                if (err) return reject(err);
                if (result) {
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
            });
        }).catch(e => {
            reject({
                success: false,
                message: "Username/Email or Password is incorrect",
            });
        })
    })
}