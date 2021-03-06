import 'module-alias/register';
import cors from 'cors'
import express from 'express'
import { v1 } from './routes'
import { RESTResp, MongoDBClient } from '@project-miuna/utils'

require('dotenv').config()
const server = express()
server.use(cors())
server.use(express.json())
console.log(process.env.MONGO_CON_STR)
let mongo = new MongoDBClient(process.env.MONGO_CON_STR as string);
mongo.start();
server.use(async (req, res, next) => {
  if(!mongo.isReady) {
    const response: RESTResp<never> = {
      success: false,
      statusCode: 503,
      message: 'Server is in bootup state, please try again later',
    }
    return res.status(503).send(response);
  }
  console.log('Time:', Date.now(), 'METHOD:', req.method, "PATH:", req.url);
  (req as any).db = mongo;
  next()
});
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
server.listen(process.env.PORT || 3000)
export default server