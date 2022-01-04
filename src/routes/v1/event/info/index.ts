import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent, ModelType } from '@project-miuna/utils'
router.get('/:id', requireAuth, async (_, res) => {
    let req: MinuRequest = _ as any;
    let event: Event = await getEventByID(req.db, req.params.id);
    if (!event) {
        const response: RESTResp<never> = {
            success: false,
            statusCode: 404,
            message: 'event not found',
        }
        return res.status(404).send(response);
    }
    if (event.state == EventState.DELETED) {
        const response: RESTResp<never> = {
            success: false,
            statusCode: 403,
            message: 'event not found',
        }
        return res.status(403).send(response);
    }
    //send event infomation
    const response: RESTResp<object> = {
        success: true,
        statusCode: 200,
        message: 'event found',
        content: event
    }
    return res.status(200).send(response);
});
export default router