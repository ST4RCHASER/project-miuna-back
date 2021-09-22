import { MongoDBClient, User } from '@project-miuna/utils'
export const getUserByUsername = async (db: MongoDBClient, username: string): Promise<User> => {
    return new Promise(async (resolve, reject) => {
        let userDB = db.getUserModel();
        let userInfo = await userDB.findOne({
            $or: [
                { lowerUsername: username.toLowerCase() },
            ]
        });
        if (userInfo == null || typeof userInfo === 'undefined') return reject('User not found');
        return resolve({
            id: userInfo._id,
            username: userInfo.username,
            lowerUsername: userInfo.lowerUsername,
            email: userInfo.email,
            password: userInfo.password,
            raw: userInfo
        });
    })
}