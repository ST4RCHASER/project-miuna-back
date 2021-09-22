import express from 'express'
const router = express.Router()
import { RESTResp, getUserByEmail, getUserByUsername, makeNewUser, MongoDBClient } from '@project-miuna/utils'
router.post('/', async (_, res) => {
  const blacklistDomain = ['starchaser.me'];
  let body = _.body;
  let db: MongoDBClient = (_ as any).db;
  try {
    let user0 = await getUserByEmail(db, body.email);
    let user1 = await getUserByUsername(db, body.username);
    if (user0) {
      return res.status(409).send({
        success: false,
        statusCode: 409,
        message: 'This email has already been used.',
      })
    }
    if (blacklistDomain.includes(_.body.email)) {
      return res.status(409).json({
        status: false,
        message: 'This email domain cannot be used.'
      });
    }
    if (user1) {
      return res.status(409).send({
        success: false,
        statusCode: 409,
        message: 'This username has already been used.',
      })
    }
    makeNewUser(db, body.email, body.username, body.password)
  } catch (e) {
    res.status(405).send({
      success: false,
      statusCode: 405,
      message: 'invalid from',
    })
  }
})
router.all('/', (_, res) => {
  const response: RESTResp<never> = {
    success: false,
    statusCode: 405,
    message: 'invalid method',
  }
  res.status(405).send(response)
})
export default router