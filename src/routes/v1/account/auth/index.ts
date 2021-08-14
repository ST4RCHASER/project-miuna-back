import express from 'express'
const router = express.Router()
import firebase from 'firebase-admin';
import { RESTResp, authUser } from '@project-miuna/utils'
router.post('/', (_, res) => {
  let body = _.body;
  console.log(body);
  authUser(body.username,body.password).then((result) => {
    if (result.success) {
      return res.status(200).send(result.message + ' TOKEN: ' + result.token)
    }else {
      return res.status(400).send(result.message)
    }
  }).catch(error => {
    return res.status(400).send(error.message)
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