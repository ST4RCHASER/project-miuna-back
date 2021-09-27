import { MongoDBClient, ModelType, FormRecord, getUserByID, getFormByID, EventRecord, getEventByID } from '@project-miuna/utils'
export const getEventRecordByID = async (db: MongoDBClient, id: string): Promise<EventRecord> => {
    return new Promise(async (resolve, reject) => {
        let fromDB = db.getModel(ModelType.EVENT_RECORDS);
        let query = await fromDB.findOne({
            eventID: id,
        });
        if (query == null || typeof query === 'undefined') return reject('EventRecord not found');
        let userInfo = undefined;
        let eventInfo = undefined;
        try {
            userInfo = await getUserByID(db, query.ownerID);
        } catch (e) { }
        try {
            eventInfo = await getEventByID(db, query.eventID);
        } catch (e) { }
        return resolve({
            id: query._id,
            ownerID: query.ownerID,
            eventID: query.eventID,
            timeJoin: query.timeJoin,
            timeLeave: query.timeLeave,
            created: query.created,
            owner: userInfo,
            event: eventInfo,
            raw: query
        });
    })
}