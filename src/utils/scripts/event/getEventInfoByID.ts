import { MongoDBClient, Event, getFormByEventID } from '@project-miuna/utils'
export const getEventInfoByID = async (db: MongoDBClient, id: string): Promise<Event> => {
    return new Promise(async (resolve, reject) => {
        let eventDB = db.getEventModel();
        let eventInfo = await eventDB.findById(id);
        if (eventInfo == null || typeof eventInfo === 'undefined') return reject('Event not found');
        let form = null;
        try {
            if(eventInfo.id) {
                form = await getFormByEventID(db, eventInfo.id);
            }
        }catch(ex){}
        return resolve({
            id: eventInfo._id,
            name: eventInfo.name,
            ownerID: eventInfo.ownerID,
            time: {
                created: eventInfo.time.created,
                start: eventInfo.time.start,
                end: eventInfo.time.end,
            },
            form: form,
            state: eventInfo.state,
            options: eventInfo.options,
            raw: eventInfo,
        });
    })
}