import firebase from 'firebase-admin';
import { User } from '@project-miuna/utils'
export const getUserByUsername = async (usernameOrEmail: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        let db = firebase.database();
        let userDB = db.ref("users");
        userDB.orderByChild("username")
            .equalTo(usernameOrEmail)
            .limitToFirst(1)
            .once("value", function (snapshot) {
                let this_user = {
                    key: snapshot.key,
                    value: snapshot.val(),
                };
                if (this_user.value == null) {
                    reject('User not found');
                } else {
                    let userID = Object.keys(this_user.value)[0];
                    this_user.value = this_user.value[Object.keys(this_user.value)[0]];
                    resolve({
                        id: userID,
                        username: this_user.value.username,
                        email: this_user.value.email,
                        password: this_user.value.password,
                        raw: this_user
                    })
                }
            }).then(error => {
                reject(error);
            });
    })
}