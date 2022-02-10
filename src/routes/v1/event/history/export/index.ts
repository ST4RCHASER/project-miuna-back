import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent, ModelType } from '@project-miuna/utils'
import excelJS from 'exceljs'
router.get('/:id', async (_, res) => {
    try {
        let req: MinuRequest = _ as any;
        let userResult = await req.db.getModel(ModelType.EVENT_RECORDS).find({ownerID: req.params.id});
        let eventList: any[] = [];
        if(userResult) {
            for(const event of userResult) {
                let eventInfo = await getEventByID(req.db, event.eventID);
                if(eventInfo && eventInfo.state != EventState.DELETED) {
                    event.eventInfo = eventInfo;
                    eventList.push({
                        eventID: event.eventID,
                        eventInfo: eventInfo,
                        ownerID: event.ownerID,
                        created: event.created,
                        timeJoin: event.timeJoin,
                        timeLeave: event.timeLeave,
                    });
                }
            }
        }
        
    } catch (e) {
        console.log(e);
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