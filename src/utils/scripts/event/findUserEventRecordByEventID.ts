import { MongoDBClient, ModelType, EventRecord, getUserByID, getEventByID } from '@project-miuna/utils'
export const findUserEventRecordByEventID = async (db: MongoDBClient, userID: string, eventID: string): Promise<EventRecord[]> => {
    return new Promise(async (resolve) => {
        let query = db.getModel(ModelType.EVENT_RECORDS);
        let recordList: EventRecord[] = [];
        let eventInfo = await query.find({
            ownerID: userID,
            eventID: eventID,
        });
        if (eventInfo != null && typeof eventInfo !== 'undefined' && eventInfo.length > 0) {
            for (const e of eventInfo) {
                if (e && e.ownerID && e.eventID) {
                    let owner = undefined;
                    let event = undefined;
                    try {
                        owner = await getUserByID(db, e.ownerID)
                    } catch (e) { }
                    try {
                        event = await getEventByID(db, e.eventID)
                    } catch (e) { }
                    recordList.push({
                        id: e._id,
                        ownerID: e.ownerID,
                        eventID: e.eventID,
                        timeJoin: e.timeJoin,
                        timeLeave: e.timeLeave,
                        created: e.created,
                        owner: owner,
                        event: event,
                        raw: e
                    })
                }
            }
        }
        return resolve(recordList);
    })
}