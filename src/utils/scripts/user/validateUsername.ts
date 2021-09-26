export const validateUsername = (username: string): boolean => {
    const regex = /^(?=.{4,16}$)(?![.])[a-zA-Z0-9._]+(?<![.])$/;
    return regex.test(username);
}