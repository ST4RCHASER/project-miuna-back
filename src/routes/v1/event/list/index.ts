import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, getEventListByUser, MinuRequest } from '@project-miuna/utils'
router.get('/', requireAuth, async (_, res) => {
    let req = <MinuRequest>_;
    try {
        const response: RESTResp<Event[]> = {
            success: true,
            statusCode: 200,
            message: 'event list obtained',
            content: await getEventListByUser(req.db, req.user)
        }
        res.status(200).send(response)
    } catch (err: any) {
        console.log(err.stack)
        const response: RESTResp<never> = {
            success: false,
            statusCode: 400,
            message: err,
        }
        res.status(400).send(response)
    }
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