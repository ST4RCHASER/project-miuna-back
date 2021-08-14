import auth from './auth'
import info from './info'
import reg from './reg'
import express from 'express'
const router = express.Router()

router.use('/auth', auth)
router.use('/reg', reg)
router.use('/info', info)
export default router