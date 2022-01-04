import { EventForm } from './EventForm'
import { EventTime } from './EventTime'
import { EventOptions } from './EventOptions'
import { EventState } from '..'
export interface Event {
    id?: string
    name: string
    ownerID: string
    time: EventTime
    state: EventState
    options?: EventOptions
    raw?: any
    form?: EventForm
    description?: string
}