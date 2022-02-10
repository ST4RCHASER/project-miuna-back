import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent, ModelType } from '@project-miuna/utils'
import excelJS from 'exceljs'
router.get('/', requireAuth, async (_, res) => {
    try {
        let req: MinuRequest = _ as any;
        let uid = req.user.id;
        let eventResult = await req.db.getModel(ModelType.EVENT_RECORDS).find({ownerID: uid});
        let eventList: any[] = [];
        if(eventResult) {
            for(const event of eventResult) {
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
        //send event infomation
        const response: RESTResp<object> = {
            success: true,
            statusCode: 200,
            message: 'event history obtained',
            content: eventList
        }
        res.status(200).send(response)
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