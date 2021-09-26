import mongoose, { Mongoose, Schema, Model } from "mongoose";
export class MongoDBClient {
    public connString: string;
    private connection: Mongoose;
    private models: Model<any>[] = [];
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
            class: {
                type: Number,
                default: 0
            },
            created: {
                type: String,
                default: new Date().getTime()
            }
        })
        const event = new Schema({
            name: String,
            ownerID: String,
            time: Object,
            state: {
                type: Number,
                default: 0
            },
            options: Object,
        })
        const form = new Schema({
            created: String,
            eventID: String,
            joinFrom: Array,
            leaveFrom: Array
        })
        this.models.push(this.getConnection().model('user', user));
        this.models.push(this.getConnection().model('event', event));
        this.models.push(this.getConnection().model('form', form));
        console.log('Schema registered');
    }
    getUserModel(): Model<any> {
        return this.models[0];
    }
    getEventModel(): Model<any> {
        return this.models[1];
    }
    getFormModel(): Model<any> {
        return this.models[2];
    }
}