import express from 'express'
const router = express.Router()
import account from './account'
router.use('/account', account)
export default router