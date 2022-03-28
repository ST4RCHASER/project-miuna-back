import { EventForm } from './EventForm'
import { EventTime } from './EventTime'
import { EventOptions } from './EventOptions'
import { EventState } from '..'
import { qrType } from './qrType'
export interface Event {
    id?: string
    name: string
    ownerID: string
    time: EventTime
    state: EventState
    hash?: string
    options?: EventOptions
    raw?: any
    form?: EventForm
    qrType?: qrType
    description?: string
}