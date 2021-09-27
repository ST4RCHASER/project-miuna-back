import { MongoDBClient, Event, ModelType } from '@project-miuna/utils'
export const makeNewEvent = async (db: MongoDBClient, event: Event): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        let eventDB = db.getModel(ModelType.EVENT);
        delete event.raw;
        try {
            eventDB.create(event);
            return resolve();
        } catch (err) {
            return reject(err);
        }
    })
}