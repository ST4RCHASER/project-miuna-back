import { MongoDBClient } from "utils/MongoDBClient";
import { User } from "utils/types/User";
import express from 'express'
export interface MinuRequest extends express.Request {
    db: MongoDBClient
    user: User
}