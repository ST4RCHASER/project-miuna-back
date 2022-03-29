import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent, ModelType } from '@project-miuna/utils'
router.put('/:id', requireAuth, async (_, res) => {
    try {
        let req: MinuRequest = _ as any;
        let event: Event = await getEventByID(req.db, req.params.id);
        let body = req.body;
        if (!body || !body.name || !body.time || !body.time.start || !body.time.end || !req.params.id) {
            console.log(body);
            const response: RESTResp<never> = {
                success: false,
                statusCode: 409,
                message: 'missing some field',
            }
            return res.status(409).send(response);
        }
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
            return res.status(409).send(response);
        }
        if (event.ownerID.toString() != req.user.id.toString()) {
            const response: RESTResp<never> = {
                success: false,
                statusCode: 409,
                message: 'you are not the owner of this event',
            }
            return res.status(409).send(response);
        }
        await req.db.getModel(ModelType.EVENT).findByIdAndUpdate(req.params.id, {
            name: body.name || 'unnamed event',
            ownerID: req.user.id,
            qrType: body.qrType || 0,
            loc_check: !!body.loc_check,
            loc_lat: body.loc_lat || 0,
            loc_lng: body.loc_lng || 0,
            time: {
                created: new Date().getTime().toString(),
                start: body.time.start,
                end: body.time.end
            }
        }, { new: true });
        const response: RESTResp<never> = {
            success: true,
            statusCode: 200,
            message: 'event updated',
        }
        return res.status(200).send(response);
    } catch (e) {
        return res.status(500).send(
            {
                success: false,
                statusCode: 500,
                message: 'internal server error',
            }
        );
    }
});
export default router