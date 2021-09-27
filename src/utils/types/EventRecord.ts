import { Event, User } from "..";

export interface EventRecord {
    id?: string
    ownerID: string,
    eventID: string;
    timeJoin: string,
    timeLeave: string,
    created: string,
    readonly owner?: User
    readonly event?: Event
    readonly raw?: any
}
