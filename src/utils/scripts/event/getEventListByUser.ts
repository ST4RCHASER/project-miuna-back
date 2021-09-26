import { MongoDBClient, User, Event, getFormByEventID } from '@project-miuna/utils'
export const getEventListByUser = async (db: MongoDBClient, user: User): Promise<Event[]> => {
    return new Promise(async (resolve) => {
        let eventDB = db.getEventModel();
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
                eList.push({
                    id: doc._id,
                    name: doc.name,
                    ownerID: doc.ownerID,
                    time: {
                        created: doc.time.created,
                        start: doc.time.start,
                        end: doc.time.end,
                    },
                    form: form,
                    options: doc.options,
                    state: doc.state,
                    raw: doc,
                })
            }
        }
        return resolve(eList);
    })
}