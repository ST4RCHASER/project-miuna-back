import { EventForm, FormRecordMeta, User } from "..";

export interface FormRecord {
    ownerID: string
    formID: string
    formData: FormRecordMeta[]
    readonly created: String
    readonly owner?: User
    readonly form?: EventForm
    readonly raw?: any
} 