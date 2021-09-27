import { MongoDBClient, ModelType, FormRecord, getUserByID, getFormByID } from '@project-miuna/utils'
export const getFormRecordByID = async (db: MongoDBClient, id: string): Promise<FormRecord> => {
    return new Promise(async (resolve, reject) => {
        let fromDB = db.getModel(ModelType.FORM_RECORDS);
        let query = await fromDB.findOne({
            eventID: id,
        });
        if (query == null || typeof query === 'undefined') return reject('FormRecord not found');
        let userInfo = undefined;
        let formInfo = undefined;
        try {
            userInfo = await getUserByID(db, query.ownerID);
        } catch (e) { }
        try {
            formInfo = await getFormByID(db, query.formID);
        } catch (e) { }
        return resolve({
            ownerID: query.ownerID,
            formID: query.fromID,
            formData: query.formData,
            created: query.created,
            owner: userInfo,
            form: formInfo,
            raw: query
        });
    })
}