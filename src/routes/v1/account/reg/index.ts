import express from 'express'
const router = express.Router()
import { RESTResp, getUserByEmail, getUserByUsername, makeNewUser, MongoDBClient } from '@project-miuna/utils'
router.post('/', async (_, res) => {
  const blacklistDomain = ['starchaser.me'];
  let body = _.body;
  let db: MongoDBClient = (_ as any).db;
  console.log(body)
  try {
    if (!body || !body.email || !body.username || !body.password) {
      console.log(body);
      const response: RESTResp<never> = {
        success: false,
        statusCode: 409,
        message: 'missing some field',
      }
      return res.status(409).send(response);
    }
    if (blacklistDomain.includes(_.body.email)) {
      const response: RESTResp<never> = {
        success: false,
        statusCode: 409,
        message: 'this email domain cannot be used.',
      }
      return res.status(409).send(response);
    }
    try {
      await getUserByEmail(db, body.email);
      const response: RESTResp<never> = {
        success: false,
        statusCode: 409,
        message: 'this email has already been used.',
      }
      return res.status(409).send(response);
    } catch (ec0) { }
    try {
      await getUserByUsername(db, body.username);
      const response: RESTResp<never> = {
        success: false,
        statusCode: 409,
        message: 'this username has already been used.',
      }
      return res.status(409).send(response);
    } catch (ec1) { }
    makeNewUser(db, body.email, body.username, body.password)
    const response: RESTResp<never> = {
      success: true,
      statusCode: 201,
      message: 'user created',
    }
    return res.status(201).send(response);
  } catch (e) {
    console.error('ERROR:', e)
    const response: RESTResp<never> = {
      success: false,
      statusCode: 405,
      message: 'invalid from',
    }
    return res.status(405).send(response);
  }
})
router.all('/', (_, res) => {
  const response: RESTResp<never> = {
    success: false,
    statusCode: 405,
    message: 'invalid method',
  }
  return res.status(405).send(response);
})
export default router