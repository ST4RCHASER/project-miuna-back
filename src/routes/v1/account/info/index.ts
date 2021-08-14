import express from 'express'
const router = express.Router()
import { RESTResp, getJWTSecret } from '@project-miuna/utils'
router.get('/', (_, res) => {
    const response: RESTResp<never> = {
        success: false,
        statusCode: 200,
        message: 'user info obtained',
    }
    res.status(200).send(response)
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