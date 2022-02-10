import list from './list'
import create from './create'
import deleteR from './delete'
import express from 'express'
import scan from './scan'
import edit from './edit'
import info from './info'
import join from './join'
import leave from './leave'
import joined from './joined'
import export_ from './export'
import history from './history'
import export_user from './history/export'
const router = express.Router()

router.use('/list', list)
router.use('/create', create)
router.use('/delete', deleteR)
router.use('/scan', scan)
router.use('/edit', edit)
router.use('/info', info)
router.use('/join', join)
router.use('/leave', leave)
router.use('/joined', joined)
router.use('/export', export_)
router.use('/history', history)
router.use('/history/export', export_user)

export default router




