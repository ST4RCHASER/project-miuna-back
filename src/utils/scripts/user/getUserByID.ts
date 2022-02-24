import { ModelType, MongoDBClient, User } from '@project-miuna/utils'
export const getUserByID = async (db: MongoDBClient, id: string): Promise<User> => {
    return new Promise(async (resolve, reject) => {
        let userDB = db.getModel(ModelType.USERS);
        let userInfo = await userDB.findById(id);
        if (userInfo == null || typeof userInfo === 'undefined') return reject('User not found');
        return resolve({
            id: userInfo._id,
            username: userInfo.username,
            lowerUsername: userInfo.lowerUsername,
            email: userInfo.email,
            password: userInfo.password,
            created: userInfo.created,
            class: userInfo.class,
            major: userInfo.major,
            name: userInfo.name,
            sec: userInfo.sec,
            student_id: userInfo.student_id,
            raw: userInfo
        });
    })
}