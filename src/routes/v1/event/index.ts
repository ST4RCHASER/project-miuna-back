import list from './list'
import create from './create'
import express from 'express'
const router = express.Router()

router.use('/list', list)
router.use('/create', create)
export default router




