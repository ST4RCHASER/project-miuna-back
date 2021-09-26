import express from 'express'
const router = express.Router()
import account from './account'
import event from './event'
router.use('/account', account)
router.use('/event', event)
export default router