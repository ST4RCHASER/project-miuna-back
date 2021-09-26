import { QRCodeMode } from "./QRCodeMode";

export interface EventOptions {
    singleCheckIn?: true | false
    lockedDistance?: number
    qrMode?: QRCodeMode
}