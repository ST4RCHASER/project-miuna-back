import cors from 'cors'
import express from 'express'
import { v1 } from './routes'
import 'module-alias/register';
import { RESTResp, getFirebaseConfig } from '@project-miuna/utils'
import firebase from 'firebase-admin';
require('module-alias/register')
require('dotenv').config()
const server = express()
server.use(cors())
server.use(express.json())
firebase.initializeApp(getFirebaseConfig())
server.get('/', (req, res) => {
  const response: RESTResp<never> = {
    success: true,
    statusCode: 200,
    message: 'Project miuna',
  }
  return res.status(200).send(response)
})
server.use('/v1', v1)
server.all('*', (_, res) => {
  const response: RESTResp<never> = {
    success: false,
    statusCode: 404,
    message: 'path not found',
  }
  return res.status(404).send(response)
})
console.log('Server started...');
server.listen(3000)
export default server