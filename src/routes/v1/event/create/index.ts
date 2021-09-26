import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, MinuRequest, makeNewEvent } from '@project-miuna/utils'
router.get('/', requireAuth, async (_, res) => {
    let req = <MinuRequest>_;
    let body = req.body;
    if (!body || !body.name || !body.time || !body.time.start || !body.time.end) {
        console.log(body);
        const response: RESTResp<never> = {
            success: false,
            statusCode: 409,
            message: 'missing some field',
        }
        return res.status(409).send(response);
    }
    await makeNewEvent(req.db, {
        name: body.name || 'unnamed event',
        ownerID: req.user.id,
        time: {
            created: new Date().getTime().toString(),
            start: body.time.start,
            end: body.time.end
        },
        form: null,
        state: 0
    });
    const response: RESTResp<never> = {
        success: true,
        statusCode: 201,
        message: 'event created',
    }
    return res.status(201).send(response);
});
router.all('/', (_, res) => {
    const response: RESTResp<never> = {
        success: false,
        statusCode: 405,
        message: 'invalid method',
    }
    res.status(405).send(response);
});
export default router