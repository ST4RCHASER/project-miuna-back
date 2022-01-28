import { MongoDBClient, ModelType, getEventByID, getUserByID, EventRecord, findUserEventRecordByEventID } from '@project-miuna/utils'
export const joinUserToEvent = async (db: MongoDBClient, userID: string, eventID: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        let eRecordDB = db.getModel(ModelType.EVENT_RECORDS);
        let eventInfo = null;
        let userInfo = null;
        try {
            eventInfo = await getEventByID(db, eventID);
        } catch (ex) { }
        if (eventInfo == null || typeof eventInfo === 'undefined' || eventInfo.id == null || typeof eventInfo.id == 'undefined') return reject('event not found');
        try {
            userInfo = await getUserByID(db, userID);
        } catch (ex) { }
        if (userInfo == null || typeof userInfo === 'undefined') return reject('user not found');
        let userEList = await findUserEventRecordByEventID(db, userID, eventID);
        if (userEList.length > 0) {
            for (const erec of userEList) {
                if (erec.timeLeave == '-1') {
                    return reject('this user already join this event');
                }
            }
        }
        console.log('uinfo',userInfo)
        let record: EventRecord = {
            ownerID: userInfo.id,
            eventID: eventInfo.id,
            timeJoin: new Date().getTime().toString(),
            timeLeave: '-1',
            created: new Date().getTime().toString()
        }
        let result = await eRecordDB.create(record)
        return resolve(result._id);
    })
}