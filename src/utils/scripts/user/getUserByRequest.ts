import { User, getJWTSecret, getUserByToken, MinuRequest } from '@project-miuna/utils'
import express from 'express'
export const getUserByRequest = (request: MinuRequest): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        try {
            if (typeof request == 'undefined' || typeof request.headers == 'undefined' || typeof request.headers['authorization'] == 'undefined') return reject('Invalid token');
            let token = request.headers['authorization'].replace('Bearer ', '');
            if (typeof token == 'string') {
                getUserByToken((request as any).db, token).then(userInfo => {
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