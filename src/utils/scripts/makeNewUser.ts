import { MongoDBClient } from "utils/MongoDBClient";

export const makeNewUser = (db: MongoDBClient, email: string, username: string, password: string): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
        let userDB = db.getUserModel();
        let result = await userDB.create({
            email: email.toLowerCase(),
            username: username,
            lowerUsername: username.toLowerCase(),
            password: password,
            created: new Date().getTime(),
        })
        if (result != null && result._id != null) {
            return resolve(result._id)
        } else {
            return reject(result)
        }
    })

}