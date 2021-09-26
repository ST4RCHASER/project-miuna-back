import { MongoDBClient, User } from '@project-miuna/utils'
export const getUserByInfo = async (db: MongoDBClient, username: string): Promise<User> => {
    return new Promise(async (resolve, reject) => {
        let userDB = db.getUserModel();
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
            raw: userInfo
        });
    })
}