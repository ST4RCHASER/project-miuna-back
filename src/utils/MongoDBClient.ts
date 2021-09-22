import mongoose, { Mongoose, Schema, Model } from "mongoose";
export class MongoDBClient {
    public connString: string;
    private connection: Mongoose;
    private models: Model<any>[];
    constructor(connString: string) {
        this.connString = connString;
    }
    async start() {
        try {
            this.connection = await mongoose.connect(this.connString);
            (global as any).db = this;
            console.log(`connection created : ${this.connString}`)
            this.registerSchema();
        } catch (e) {
            console.log(`SQL connection failed : ${e}`)
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
        this.models[0] = this.getConnection().model('user', user);
        console.log('Schema registered');
    }
    getUserModel(): Model<any> {
        return this.models[0];
    }
}