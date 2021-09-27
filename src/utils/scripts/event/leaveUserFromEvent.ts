import { MongoDBClient, ModelType } from '@project-miuna/utils'
export const leaveUserFromEvent = async (db: MongoDBClient, recordID: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        let eRecordDB = db.getModel(ModelType.EVENT_RECORDS);
        let result = await eRecordDB.findByIdAndUpdate({
            _id: recordID,
        }, {
            timeLeave: new Date().getTime().toString()
        })
        return resolve(recordID);
    })
}