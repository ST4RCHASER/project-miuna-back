import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent, ModelType, makeB32 } from '@project-miuna/utils'
let oneTimeHashList: oneTimeHash[] = [];
interface oneTimeHash {
    hash: string,
    id: string,
}
router.get('/:id', requireAuth, async (_, res) => {
    try {
        let req: MinuRequest = _ as any;
        if (!req.query.change) {
            const response: RESTResp<never> = {
                success: false,
                statusCode: 403,
                message: 'change error',
            }
            return res.status(403).send(response);
        }
        let change = req.query.change === 'true';
        console.log('change', change);

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
        let count = await req.db.getModel(ModelType.EVENT_RECORDS).countDocuments({ eventID: event.id, ownerid: req.user.id, timeLeave: -1 });
        let history: any[] = [];
        let historyResult = await req.db.getModel(ModelType.EVENT_RECORDS).find({ eventID: event.id });
        if (historyResult) {
            for (const his of historyResult) {
                let user = await req.db.getModel(ModelType.USERS).findById(his.ownerID);
                if (user) {
                    user = {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        student_id: user.student_id,
                        major: user.major,
                        sec: user.sec,
                        created: user.created,
                        lowerUsername: user.lowerUsername,
                        class: user.class,
                    }
                }
                history.push({
                    id: his.id,
                    ownerid: his.ownerID,
                    eventid: his.eventID,
                    timeJoin: his.timeJoin,
                    timeLeave: his.timeLeave,
                    created: his.created,
                    owner: user,
                });
            }
        }
        //send event infomation
        let h = oneTimeHashList.find(x => x.id == event.id);
        console.log('length', oneTimeHashList.length);

        if (event.qrType == 2) {
            if (!h) {
                h = {
                    hash: makeB32(32),
                    id: event.id?.toString() as any,
                }
                oneTimeHashList.push(h);
            }
            if (change && h) {
                h.hash = makeB32(32);
                oneTimeHashList = oneTimeHashList.filter(x => x.id != event.id?.toString());
                oneTimeHashList.push(h);
            }
        }
        const response: RESTResp<object> = {
            success: true,
            statusCode: 200,
            message: 'event found',
            content: {
                id: event.id,
                name: event.name,
                ownerID: event.ownerID,
                time: {
                    created: event.time.created,
                    start: event.time.start,
                    readable_start: new Date(event.time.start).toLocaleString(),
                    end: event.time.end,
                    readable_end: new Date(event.time.end).toLocaleString(),
                },
                oneTimeHash: h ? h.hash : '',
                form: event.form,
                options: event.options,
                state: event.state,
                qrType: event.qrType,
                hash: event.hash,
                raw: event,
                loc_check: event.loc_check,
                loc_lat: event.loc_lat,
                loc_lng: event.loc_lng,
                description: event.description || ' ',
                is_joining: count > 0,
                participants: history,
            }
        }
        return res.status(200).send(response);
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