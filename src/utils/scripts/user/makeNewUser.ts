import { MongoDBClient } from "utils/MongoDBClient";
import bcrypt from 'bcrypt';
import { ModelType } from "@project-miuna/utils";
export const makeNewUser = (db: MongoDBClient, email: string, username: string, password: string, name: string, sec: string, student_id: string): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
        let userDB = db.getModel(ModelType.USERS);
        let saltRound = process.env.SALT_ROUND || "3"
        bcrypt.hash(password, parseInt(saltRound), async (error, hash) => {
            if (error) {
                return reject(error);
            }
            let result = await userDB.create({
                email: email.toLowerCase(),
                username: username,
                lowerUsername: username.toLowerCase(),
                password: hash,
                name: name,
                sec: sec,
                student_id: student_id,
                class: 0,
                created: new Date().getTime(),
            })
            if (result != null && result._id != null) {
                return resolve(result._id)
            } else {
                return reject(result)
            }
        })
    })

}