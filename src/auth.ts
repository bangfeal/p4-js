import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDB } from "./mongo";

dotenv.config();

const SUPER_SECRET = process.env.SECRET;

type TokenPayload = {
    userId: string;
}

export const signToken = (userId: string) => {
    return jwt.sign({userId}, SUPER_SECRET!, {expiresIn: "1h"});
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SUPER_SECRET!) as TokenPayload;
    } catch (err) {
        return null;
    }
}

const usersCollection: string = "DiddyUsers"; 

export const getUserFromToken = async (token: string) => {
    const payload = verifyToken(token);
    if (!payload) return null;

    const db = getDB();
    return db.collection(usersCollection).findOne({
        _id: new ObjectId(payload.userId)
    })
}