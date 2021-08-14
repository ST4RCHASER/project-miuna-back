import { User, getJWTSecret, getUserByToken } from '@project-miuna/utils'
import express from 'express'
export const getUserByRequest = (request: express.Request): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        try {
            if (typeof request == 'undefined' || typeof request.headers == 'undefined' || typeof request.headers['authorization'] == 'undefined') return reject('Invalid token');
            let token = request.headers['authorization'].replace('Bearer ', '');
            if (typeof token == 'string') {
                getUserByToken(token).then(userInfo => {
                    if (typeof userInfo == `undefined` || typeof userInfo == `string` || userInfo == null || userInfo.raw == null) {
                        reject('User not found for this request');
                    } else {
                        resolve(userInfo);
                    }
                })
            } else {
                reject('Invalid headers');
            }
        } catch (e) {
            reject('Invalid request');
        }
    })
}