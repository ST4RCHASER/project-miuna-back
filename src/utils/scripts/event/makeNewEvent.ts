import { MongoDBClient, Event } from '@project-miuna/utils'
export const makeNewEvent = async (db: MongoDBClient, event: Event): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        let eventDB = db.getEventModel();
        delete event.raw;
        try {
            eventDB.create(event);
            return resolve();
        } catch (err) {
            return reject(err);
        }
    })
}