import { MongoDBClient, User, Event, getFormByEventID, ModelType, EventState } from '@project-miuna/utils'
export const getEventListByUser = async (db: MongoDBClient, user: User, filter: Boolean = false): Promise<Event[]> => {
    return new Promise(async (resolve) => {
        let eventDB = db.getModel(ModelType.EVENT);
        let eList: Event[] = [];
        let eventQuery = await eventDB.find({
            ownerID: user.id
        });
        if (eventQuery != null || typeof eventQuery !== 'undefined') {
            for (const doc of eventQuery) {
                let form = null;
                try {
                    if(doc.id) {
                        form = await getFormByEventID(db, doc.id);
                    }
                }catch(ex){}
                if(doc.state === EventState.DELETED) continue;
                eList.push({
                    id: doc._id,
                    name: doc.name,
                    ownerID: doc.ownerID,
                    time: {
                        created: doc.time.created,
                        start: doc.time.start,
                        end: doc.time.end,
                    },
                    form: undefined,
                    options: doc.options,
                    state: doc.state,
                    raw: doc,
                    description: doc.description || ' ',
                })
            }
        }
        return resolve(eList);
    })
}