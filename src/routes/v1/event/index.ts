import list from './list'
import create from './create'
import express from 'express'
import scan from './scan'
const router = express.Router()

router.use('/list', list)
router.use('/create', create)
router.use('/scan', scan)
export default router




