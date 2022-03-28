import mongoose, { Mongoose, Schema, Model } from "mongoose";
import { ModelType } from ".";
export class MongoDBClient {
    public connString: string;
    private connection: Mongoose;
    private models: Model<any>[] = [];
    public isReady: boolean = false;
    constructor(connString: string) {
        this.connString = connString;
    }
    async start() {
        try {
            this.connection = await mongoose.connect(this.connString);
            (global as any).db = this;
            console.log(`connection created : ${this.connString}`)
            this.registerSchema();
        } catch (e: any) {
            console.log(`SQL connection failed : ${e.stack || e}`)
        }
    }
    getConnection(): Mongoose {
        return this.connection;
    }
    registerSchema(): void {
        const user = new Schema({
            email: String,
            username: String,
            lowerUsername: String,
            password: String,
            name: String,
            sec: String,
            student_id: String,
            major: String,
            class: {
                type: Number,
                default: 0
            },
            created: {
                type: Date,
                default: new Date().getTime()
            }
        })
        const event = new Schema({
            name: String,
            ownerID: Schema.Types.ObjectId,
            time: {
                created: {
                    default: new Date().getTime(),
                    type: Date
                },
                start: Date,
                end: Date,
                type: Object
            },
            state: {
                type: Number,
                default: 1
            },
            qrType: {
                type: Number,
                default: 0
            },
            hash: String,
            options: Object,
            description: String,
        })
        const form = new Schema({
            eventID: String,
            joinForm: Array,
            leaveForm: Array,
            created: {
                type: String,
                default: new Date().getTime()
            }
        })
        const rec_event = new Schema({
            ownerID: Schema.Types.ObjectId,
            eventID: Schema.Types.ObjectId,
            timeJoin: Date,
            timeLeave: {
                type: Date,
                default: "-1"
            },
            created: {
                type: Date,
                default: new Date().getTime()
            }
        })
        const rec_form = new Schema({
            ownerID: Schema.Types.ObjectId,
            formID: Schema.Types.ObjectId,
            formData: Array,
            created: {
                type: Date,
                default: new Date().getTime()
            }
        })
        this.models.push(this.getConnection().model('user', user));
        this.models.push(this.getConnection().model('event', event));
        this.models.push(this.getConnection().model('form', form));
        this.models.push(this.getConnection().model('event_record', rec_event));
        this.models.push(this.getConnection().model('form_record', rec_form));
        this.isReady = true;
        console.log('Schema registered');
    }
    getModel(type: ModelType): Model<any> {
        return this.models[type];
    }
}