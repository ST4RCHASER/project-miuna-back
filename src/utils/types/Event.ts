import { EventForm } from './EventForm'
import { EventTime } from './EventTime'
import { EventOptions } from './EventOptions'
export interface Event {
    id?: string
    name: string
    ownerID: string
    time: EventTime
    form: EventForm | null
    state: number
    options?: EventOptions
    raw?: any
}