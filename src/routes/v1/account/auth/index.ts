import express from 'express'
const router = express.Router()
import { RESTResp, getJWTSecret } from '@project-miuna/utils'
router.post('/', (_, res) => {
  console.log(_.body.test);
  let secret = getJWTSecret();
  console.log(secret);
  return res.status(200).send('OK')
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