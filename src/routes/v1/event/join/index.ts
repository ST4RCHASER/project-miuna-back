import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, getEventListByUser, MinuRequest, getEventByID, EventState } from '@project-miuna/utils'
router.post('/', requireAuth, async (_, res) => {
    let req = <MinuRequest>_;
    let body = req.body;
    if (!body || !body.id) {
        console.log(body);
        const response: RESTResp<never> = {
            success: false,
            statusCode: 409,
            message: 'missing some field',
        }
        return res.status(409).send(response);
    }
    try {
        let event = await getEventByID(req.db, body.id);
        if (event.state == EventState.DISABLED) {
            const response: RESTResp<never> = {
                success: false,
                statusCode: 403,
                message: 'sorry, this event is not enabled yet.',
            }
            return res.status(403).send(response)
        }
        if (event.state == EventState.DELETED) {
            const response: RESTResp<never> = {
                success: false,
                statusCode: 404,
                message: 'event not found',
            }
            return res.status(404).send(response)
        }
        try {
            const response: RESTResp<never> = {
                success: true,
                statusCode: 200,
                message: 'event joined successfully.',
            }
            return res.status(200).send(response)
        } catch (err: any) {
            console.log(err.stack)
            const response: RESTResp<never> = {
                success: false,
                statusCode: 400,
                message: err,
            }
            return res.status(400).send(response)
        }
    } catch (err: any) {
        const response: RESTResp<never> = {
            success: false,
            statusCode: 404,
            message: err,
        }
        return res.status(404).send(response)
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