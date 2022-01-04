import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent, ModelType } from '@project-miuna/utils'
router.delete('/:id', requireAuth, async (_, res) => {
    let req: MinuRequest = _ as any;
    //Get event by id and set state to delete
    let event: Event = await getEventByID(req.db, req.params.id);
    if (!event) {
        const response: RESTResp<never> = {
            success: false,
            statusCode: 404,
            message: 'event not found',
        }
        return res.status(404).send(response);
    }
    if (event.ownerID !== req.user.id) {
        const response: RESTResp<never> = {
            success: false,
            statusCode: 409,
            message: 'you are not the owner of this event',
        }
        return res.status(409).send(response);
    }
    if (event.state !== EventState.DELETED) {
        const response: RESTResp<never> = {
            success: false,
            statusCode: 409,
            message: 'this event is already deleted',
        }
        return res.status(409).send(response);
    }
    await req.db.getModel(ModelType.EVENT).findByIdAndUpdate(req.params.id, {
        state: EventState.DELETED
    }, { new: true });
    const response: RESTResp<never> = {
        success: true,
        statusCode: 200,
        message: 'event deleted',
    }
    return res.status(200).send(response);
});
export default router