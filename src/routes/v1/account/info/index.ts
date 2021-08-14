import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, getUserByRequest, User } from '@project-miuna/utils'
router.get('/', requireAuth, (_, res) => {
    getUserByRequest(_).then(user => {
        let userEdited:any = user;
        delete userEdited.raw;
        delete userEdited.password;
        const response: RESTResp<User> = {
            success: false,
            statusCode: 200,
            message: 'user info obtained',
            content: userEdited
        }
        res.status(200).send(response)
    }).catch(err => {
        const response: RESTResp<User> = {
            success: false,
            statusCode: 503,
            message: 'User obtain failed: ' +err,
        }
        res.status(503).send(response)
    })
})
router.all('/', (_, res) => {
    const response: RESTResp<never> = {
        success: false,
        statusCode: 405,
        message: 'invalid method',
    }
    res.status(405).send(response)
})
export default router