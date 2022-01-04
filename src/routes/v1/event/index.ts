import list from './list'
import create from './create'
import deleteR from './delete'
import express from 'express'
import scan from './scan'
const router = express.Router()

router.use('/list', list)
router.use('/create', create)
router.use('/delete', deleteR)
router.use('/scan', scan)

export default router




