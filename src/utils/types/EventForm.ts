import { FormMeta } from "./FormMeta";
export interface EventForm {
    id: string
    readonly created: string
    eventID: string
    join: FormMeta[]
    leave: FormMeta[]
    readonly raw?: any
}