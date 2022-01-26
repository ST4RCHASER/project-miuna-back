import list from './list'
import create from './create'
import deleteR from './delete'
import express from 'express'
import scan from './scan'
import edit from './edit'
import info from './info'
import join from './join'
const router = express.Router()

router.use('/list', list)
router.use('/create', create)
router.use('/delete', deleteR)
router.use('/scan', scan)
router.use('/edit', edit)
router.use('/info', info)
router.use('/join', join)

export default router




