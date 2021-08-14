import { User, getJWTSecret, getUserByUsername } from '@project-miuna/utils'
import jwt from 'jsonwebtoken';
export const getUserByToken = (token: string): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        try {
            let tokenInfo = jwt.verify(token, getJWTSecret())
            if (typeof tokenInfo != 'string') {
                getUserByUsername(tokenInfo.username).then(userInfo => {
                    if (typeof userInfo == `undefined` || typeof userInfo == `string` || userInfo == null || userInfo.raw == null) {
                        reject('User not found for this token');
                    } else {
                        resolve(userInfo);
                    }
                })
            } else {
                reject('Invalid token');
            }
        } catch (e) {
            reject('Invalid token');
        }
    })
}