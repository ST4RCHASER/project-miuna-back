import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent } from '@project-miuna/utils'
router.post('/', requireAuth, async (_, res) => {
    let req = <MinuRequest>_;
    let body = req.body;
    if (!body || (!body.id && !body.rec)) {
        console.log(body);
        const response: RESTResp<never> = {
            success: false,
            statusCode: 409,
            message: 'missing some field',
        }
        return res.status(409).send(response);
    }
    try {
        if (!body.id) {//Leave using recordID
            let record = await getEventRecordByID(req.db, body.rec);
            if (record.timeLeave == '-1') {
                const response: RESTResp<never> = {
                    success: true,
                    statusCode: 400,
                    message: 'this event is already leaved',
                }
                return res.status(400).send(response)
            }
            await leaveUserFromEvent(req.db, body.rec);
            const response: RESTResp<never> = {
                success: true,
                statusCode: 200,
                message: 'event leaved successfully.',
            }
            return res.status(200).send(response)
        } else {//JOIN or Leave all using eventID and ownerID
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
            let joinList = await findUserEventRecordByEventID(req.db, req.user.id, body.id);
            let isLeave = false;
            if (joinList.length > 0) {
                for (const joinedEvent of joinList) {
                    if (joinedEvent.timeLeave == '-1' && joinedEvent.id) {
                        await leaveUserFromEvent(req.db, joinedEvent.id);
                        isLeave = true;
                    }
                }
            }
            if (isLeave) {
                const response: RESTResp<never> = {
                    success: true,
                    statusCode: 200,
                    message: 'event left successfully.',
                }
                return res.status(200).send(response)
            } else {
                let result = await joinUserToEvent(req.db, req.user.id, body.id);
                const response: RESTResp<string> = {
                    success: true,
                    statusCode: 200,
                    message: 'event joined successfully.',
                    content: result
                }
                return res.status(200).send(response)
            }
        }
    } catch (err: any) {
        const response: RESTResp<never> = {
            success: false,
            statusCode: 400,
            message: err,
        }
        return res.status(400).send(response)
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