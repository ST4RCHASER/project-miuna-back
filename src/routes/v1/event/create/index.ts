import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, MinuRequest, makeNewEvent, EventState, makeB32 } from '@project-miuna/utils'
import crypto from "crypto";
router.post('/', requireAuth, async (_, res) => {
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
            created: new Date().getTime(),
            start: new Date(body.time.start).getTime(),
            end: new Date(body.time.end).getTime(),
        },
        qrType: body.qrType || 0,
        description: body.description || '',
        loc_check: !!body.loc_check,
        loc_lat: body.loc_lat || 0,
        loc_lng: body.loc_lng || 0,
        form: undefined,
        hash: makeB32(),
        state: EventState.ENABLED
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