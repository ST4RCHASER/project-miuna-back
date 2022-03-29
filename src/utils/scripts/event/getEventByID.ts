import { MongoDBClient, Event, getFormByEventID, ModelType } from '@project-miuna/utils'
export const getEventByID = async (db: MongoDBClient, id: string): Promise<Event> => {
    return new Promise(async (resolve, reject) => {
        let eventDB = db.getModel(ModelType.EVENT);
        let eventInfo = await eventDB.findById(id);
        if (eventInfo == null || typeof eventInfo === 'undefined') return reject('event not found');
        let form = undefined;
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
            hash: eventInfo.hash,
            qrType: eventInfo.qrType,
            loc_check: eventInfo.loc_check,
            loc_lat: eventInfo.loc_lat,
            loc_lng: eventInfo.loc_lng,
            description: eventInfo.description,
            options: eventInfo.options,
            raw: eventInfo,
        });
    })
}