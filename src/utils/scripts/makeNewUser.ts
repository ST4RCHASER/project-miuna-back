import firebase from 'firebase-admin';
export const makeNewUser = (email: string, username: string, password: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        firebase.database().ref('users').push({
            email: email.toLowerCase(),
            username: username,
            lowerUsername: username.toLowerCase(),
            password: password,
        }).then(newUserRef => {
            if (newUserRef && newUserRef.key) {
                resolve(newUserRef.key)
            } else {
                reject(newUserRef)
            }
        }).catch(e => reject(e));
    })

}