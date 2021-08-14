import express from 'express'
const router = express.Router()
import { RESTResp, getUserByEmail, getUserByUsername, makeNewUser } from '@project-miuna/utils'
router.post('/', async (_, res) => {
  const blacklistDomain = ['starchaser.me'];
  let body = _.body;
  try {
    let user0 = await getUserByEmail(body.email);
    let user1 = await getUserByUsername(body.username);
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
    makeNewUser(body.email, body.username,body.password)
  }catch (e) {
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