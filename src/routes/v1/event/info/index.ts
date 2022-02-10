import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent, ModelType } from '@project-miuna/utils'
router.get('/:id', requireAuth, async (_, res) => {
    try {
        let req: MinuRequest = _ as any;
        let event: Event = await getEventByID(req.db, req.params.id);
        let includeList: string = req.query.include as any;
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
        let count = await req.db.getModel(ModelType.EVENT_RECORDS).countDocuments({eventID: event.id, ownerid: req.user.id, timeLeave: -1});
        let history: any[] = [];
        let historyResult = await req.db.getModel(ModelType.EVENT_RECORDS).find({eventID: event.id});
        if(historyResult && includeList == 'true') { 
            for(const his of historyResult) {
                let user = await req.db.getModel(ModelType.USERS).findById(his.ownerID);
                if(user){
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
        let response : RESTResp<object>;
        if(includeList) {
            response  = {
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
                    form: event.form,
                    options: event.options,
                    state: event.state,
                    raw: event,
                    description: event.description,
                    is_joining: count > 0,
                    participants: history,
                }
            }
        }else {
            response = {
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
                    form: event.form,
                    options: event.options,
                    state: event.state,
                    raw: event,
                    description: event.description,
                    is_joining: count > 0,
                }
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