import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, getUserByRequest, User, MinuRequest, ModelType } from '@project-miuna/utils'
import bcrypt from 'bcrypt';
router.get('/', requireAuth, (_, res) => {
    let req = <MinuRequest>_;
    getUserByRequest(req).then(user => {
        let userEdited: any = user;
        delete userEdited.raw;
        delete userEdited.password;
        const response: RESTResp<User> = {
            success: true,
            statusCode: 200,
            message: 'user info obtained',
            content: userEdited
        }
        res.status(200).send(response)
    }).catch(err => {
        const response: RESTResp<User> = {
            success: false,
            statusCode: 503,
            message: 'User obtain failed: ' + err,
        }
        res.status(503).send(response)
    })
})
router.post('/', requireAuth, (_, res) => {
    let req = <MinuRequest>_;
    getUserByRequest(req).then(async user => {
        console.log(req.body)
        if (req.body.username) {
            user.username = req.body.username;
            user.lowerUsername = req.body.username.toLowerCase();
        }
        if (req.body.email && req.body.email.length > 0) user.email = req.body.email;
        if (req.body.password && req.body.password.length > 0) {
            let saltRound = process.env.SALT_ROUND || "3"
            let hash = await bcrypt.hash(req.body.password, parseInt(saltRound));
            user.password = hash;
        }
        if (req.body.name && req.body.name.length > 0) user.name = req.body.name;
        if (req.body.sec && req.body.sec.length > 0) user.sec = req.body.sec;
        if (req.body.student_id && req.body.student_id.length > 0) user.student_id = req.body.student_id;
        if (req.body.major && req.body.major.length > 0) user.major = req.body.major;
        let db = req.db.getModel(ModelType.USERS);
        db.updateOne({ _id: user.id }, user, (err: any, result: any) => {
            if (err) {
                const response: RESTResp<never> = {
                    success: false,
                    statusCode: 503,
                    message: 'User update failed: ' + err,
                }
                return res.status(503).send(response)
            }
            const response: RESTResp<never> = {
                success: true,
                statusCode: 200,
                message: 'User updated',
            }
            res.status(200).send(response)
        })
    }).catch(err => {
        const response: RESTResp<User> = {
            success: false,
            statusCode: 503,
            message: 'User obtain failed: ' + err,
        }
        res.status(503).send(response)
    })
});
router.all('/', (_, res) => {
    const response: RESTResp<never> = {
        success: false,
        statusCode: 405,
        message: 'invalid method',
    }
    res.status(405).send(response)
})
export default router