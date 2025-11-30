import { ObjectId } from "mongodb";
import { getDB } from "./mongo";
import bcrypt from "bcryptjs";

const usersCollection: string = "DiddyUsers";

export const createUser = async (email: string, password: string) => {
    const db = getDB();
    const hash = await bcrypt.hash(password, 10);

    const result = await db.collection(usersCollection).insertOne({
        email,
        password: hash
    });

    return result.insertedId.toString();
}

export const validateUser = async (email: string, password: string) => {
    const db = getDB();
    const user = await db.collection(usersCollection).findOne({email});
    if (!user) return null;

    return await bcrypt.compare(password, user.password) ? user : null;
}

export const findUserById = async (id: string) => {
    const db = getDB();
    return await db.collection(usersCollection).findOne({_id: new ObjectId(id)});
}