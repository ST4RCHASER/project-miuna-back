import express from 'express'
const router = express.Router()
import { RESTResp, getJWTSecret } from '@project-miuna/utils'
router.post('/', (_, res) => {
  let body = _.body;
    
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