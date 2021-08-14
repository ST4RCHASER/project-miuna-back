import auth from './auth'
import reg from './reg'
import express from 'express'
const router = express.Router()

router.use('/auth', auth)
router.use('/reg', reg)
export default router