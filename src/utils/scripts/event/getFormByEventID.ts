import { MongoDBClient, EventForm } from '@project-miuna/utils'
export const getFormByEventID = async (db: MongoDBClient, id: string): Promise<EventForm> => {
    return new Promise(async (resolve, reject) => {
        let fromDB = db.getFormModel();
        let eventInfo = await fromDB.findOne({
            eventID: id,
        });
        if (eventInfo == null || typeof eventInfo === 'undefined') return reject('Form not found');
        return resolve({
            id: eventInfo._id,
            created: eventInfo.created,
            eventID: eventInfo.eventID,
            join: eventInfo.join,
            leave: eventInfo.leave,
            raw: eventInfo
        });
    })
}