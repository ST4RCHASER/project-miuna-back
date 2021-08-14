import { getUserByToken, RESTResp } from '@project-miuna/utils'
export const requireAuth = (_: any, res: any, next: any) => {
    if (typeof _.headers['authorization'] != 'undefined') {
        let token = _.headers['authorization'].replace('Bearer ', '');
        getUserByToken(token).then(userInfo => {
            next();
        }).catch(error => {
            const response: RESTResp<never> = {
                success: false,
                statusCode: 403,
                message: 'Account check failed, please re-login.',
            }
            res.status(403).send(response)
        })
    } else {
        const response: RESTResp<never> = {
            success: false,
            statusCode: 401,
            message: 'Unauthorized',
        }
        res.status(401).send(response)
    }
};