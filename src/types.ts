import { ObjectId } from "mongodb";

export type User = {
    _id: ObjectId,
    email: string
}

export type Post = {
    _id?: string,
    title: string,
    date: string, // no sabia usar Date en la mutation
    author: ObjectId
}