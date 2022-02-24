import { ModelType, MongoDBClient, User } from '@project-miuna/utils'
export const getUserByInfo = async (db: MongoDBClient, username: string): Promise<User> => {
    return new Promise(async (resolve, reject) => {
        let userDB = db.getModel(ModelType.USERS);
        let userInfo = await userDB.findOne({
            $or: [
                { lowerUsername: username.toLowerCase() },
                { email: username.toLowerCase() },
                { username: username }
            ]
        });
        if (userInfo == null || typeof userInfo === 'undefined') return reject('User not found');
        return resolve({
            id: userInfo._id,
            username: userInfo.username,
            lowerUsername: userInfo.lowerUsername,
            email: userInfo.email,
            class: userInfo.class,
            created: userInfo.created,
            password: userInfo.password,
            major: userInfo.major,
            name: userInfo.name,
            sec: userInfo.sec,
            student_id: userInfo.student_id,
            raw: userInfo
        });
    })
}