import { FormMeta } from "./FormMeta";
export interface EventForm {
    id: string
    created: string
    eventID: string
    join: FormMeta[]
    leave: FormMeta[]
    raw?: any
}