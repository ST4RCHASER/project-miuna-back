import express from 'express'
const router = express.Router()
import { RESTResp, authUser, MongoDBClient, MinuRequest } from '@project-miuna/utils'
router.post('/', (_, res) => {
  let req = <MinuRequest>_;
  let body = req.body;
  let db: MongoDBClient = (req as any).db;
  console.log(body);
  authUser(db, body.username, body.password).then((result) => {
    if (result.success) {
      const response: RESTResp<string> = {
        success: true,
        statusCode: 200,
        message: result.message,
        content: result.token
      }
      res.status(200).send(response)
    } else {
      const response: RESTResp<never> = {
        success: false,
        statusCode: 400,
        message: result.message,
      }
      res.status(400).send(response)
    }
  }).catch(error => {
    const response: RESTResp<never> = {
      success: false,
      statusCode: 400,
      message: error,
    }
    res.status(400).send(response)
  })
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