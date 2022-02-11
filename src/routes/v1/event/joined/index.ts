import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, MinuRequest, ModelType } from '@project-miuna/utils'
router.get('/', requireAuth, async (_, res) => {
    let req = <MinuRequest>_;
    let db = req.db.getModel(ModelType.EVENT_RECORDS);
    let result = await db.find({ownerID: req.user.id, timeLeave: -1});
    let recordList:any[] = [];
    if(result == null) {
        const response: RESTResp<never> = {
            success: true,
            statusCode: 200,
            message: 'no any record found',
        }
        return res.status(404).send(response)
    }
    for (const res of result) {
        let event = await req.db.getModel(ModelType.EVENT).findById(res.eventID);
        if(event){
            if(new Date(res.timeLeave).getTime() == -1 && event.state == 1) {

                recordList.push({
                    record: res,
                    event: event,
                    eventOwner: await req.db.getModel(ModelType.USERS).findById(event.ownerID),
                });
            }
        }
    }
    try {
        const response: RESTResp<any[]> = {
            success: true,
            statusCode: 200,
            message: 'record list obtained',
            content: recordList
        }
        res.status(200).send(response)
    } catch (err: any) {
        console.log(err.stack)
        const response: RESTResp<never> = {
            success: false,
            statusCode: 400,
            message: err,
        }
        res.status(400).send(response)
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